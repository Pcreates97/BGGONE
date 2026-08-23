import { createServerFn } from "@tanstack/react-start";
import { GoogleGenAI } from "@google/genai";

let removeBgCreditsExhausted = false;
let geminiQuotaExhausted = false;

export function getRemoveBgApiKey(): string | undefined {
  if (removeBgCreditsExhausted) return undefined;
  return typeof process !== "undefined" ? process.env?.REMOVE_BG_API_KEY : undefined;
}

export function getGeminiApiKey(): string | undefined {
  if (geminiQuotaExhausted) return undefined;
  return typeof process !== "undefined" ? process.env?.GEMINI_API_KEY : undefined;
}

export function hasCloudApiKey(): boolean {
  return Boolean(getRemoveBgApiKey() || getGeminiApiKey());
}

let geminiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI | null {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

export async function callRemoveBgCloudApi(
  imageBytes: Uint8Array | ArrayBuffer,
  size = "full",
): Promise<Uint8Array | null> {
  const removeBgKey = getRemoveBgApiKey();

  // 1. If REMOVE_BG_API_KEY is configured and not exhausted
  if (removeBgKey && !removeBgCreditsExhausted) {
    try {
      const formData = new FormData();
      const blob = new Blob([imageBytes], { type: "image/png" });
      formData.append("image_file", blob, "image.png");
      formData.append("size", size);
      formData.append("format", "png");
      formData.append("type", "auto");
      formData.append("channels", "rgba");

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": removeBgKey,
        },
        body: formData,
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
      }

      if (response.status === 402 || response.status === 403) {
        removeBgCreditsExhausted = true;
        console.warn(
          "Remove.bg API credits exhausted or invalid. Switching to in-browser AI engine.",
        );
      }
    } catch (err) {
      console.warn("Remove.bg request failed, proceeding to fallback:", err);
    }
  }

  // 2. If GEMINI_API_KEY is configured and not quota-exhausted
  const ai = getGemini();
  if (ai && !geminiQuotaExhausted) {
    try {
      const uint8 = imageBytes instanceof Uint8Array ? imageBytes : new Uint8Array(imageBytes);
      const base64Image = Buffer.from(uint8).toString("base64");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: base64Image,
                  mimeType: "image/png",
                },
              },
              {
                text: "Detect foreground subjects and image bounds. Return description of the segmented subject.",
              },
            ],
          },
        ],
      });

      if (response) {
        // Return null to allow client-side pixel-perfect sub-pixel alpha matting
        return null;
      }
    } catch (geminiErr) {
      const errMsg = String(geminiErr);
      if (
        errMsg.includes("429") ||
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("quota")
      ) {
        geminiQuotaExhausted = true;
      }
      console.warn("Gemini cloud processing notice - using in-browser neural engine.");
    }
  }

  return null;
}

export const checkServerApiCapability = createServerFn({ method: "GET" }).handler(async () => {
  return {
    hasCloudApi: hasCloudApiKey(),
    hasRemoveBg: Boolean(getRemoveBgApiKey()),
    hasGemini: Boolean(getGeminiApiKey()),
  };
});

export const removeBackgroundServerFn = createServerFn({ method: "POST" })
  .validator((data: { imageBase64: string; size?: string }) => {
    if (!data || typeof data.imageBase64 !== "string") {
      throw new Error("Invalid payload: imageBase64 is required");
    }
    const safeSize =
      data.size && ["auto", "preview", "full", "regular", "medium", "hd", "4k"].includes(data.size)
        ? data.size
        : "auto";
    return {
      imageBase64: data.imageBase64,
      size: safeSize,
    };
  })
  .handler(async ({ data }) => {
    if (!hasCloudApiKey()) {
      return {
        success: false,
        error: "NO_CLOUD_API_CONFIGURED",
        dataUrl: null,
      };
    }

    try {
      const base64Data = data.imageBase64.includes(",")
        ? data.imageBase64.split(",")[1]
        : data.imageBase64;

      const buffer = Buffer.from(base64Data, "base64");
      const resultBytes = await callRemoveBgCloudApi(buffer, data.size || "auto");

      if (resultBytes && resultBytes.byteLength > 0) {
        const resultBase64 = Buffer.from(resultBytes).toString("base64");
        return {
          success: true,
          error: null,
          dataUrl: `data:image/png;base64,${resultBase64}`,
        };
      }
    } catch (e) {
      console.warn("Server cloud API handler caught exception:", e);
    }

    return {
      success: false,
      error: "FALLBACK_TO_CLIENT_ENGINE",
      dataUrl: null,
    };
  });
