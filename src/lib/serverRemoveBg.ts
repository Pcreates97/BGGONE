import { createServerFn } from "@tanstack/react-start";

export function getRemoveBgApiKey(): string | undefined {
  return typeof process !== "undefined" ? process.env?.REMOVE_BG_API_KEY : undefined;
}

export async function callRemoveBgCloudApi(
  imageBytes: Uint8Array | ArrayBuffer,
  size = "full",
): Promise<Uint8Array> {
  const apiKey = getRemoveBgApiKey();
  if (!apiKey) {
    throw new Error(
      "REMOVE_BG_API_KEY is not configured in the environment. Set REMOVE_BG_API_KEY in project secrets or environment settings.",
    );
  }
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
      "X-Api-Key": apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = `API request failed with status ${response.status}`;
    try {
      const json = JSON.parse(errorText);
      if (json.errors && Array.isArray(json.errors) && json.errors.length > 0) {
        message = json.errors
          .map((e: { title?: string; detail?: string }) => e.title || e.detail)
          .filter(Boolean)
          .join(" - ");
      }
    } catch {
      if (errorText) message = errorText;
    }
    throw new Error(message);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

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
    const base64Data = data.imageBase64.includes(",")
      ? data.imageBase64.split(",")[1]
      : data.imageBase64;

    const buffer = Buffer.from(base64Data, "base64");
    const resultBytes = await callRemoveBgCloudApi(buffer, data.size || "auto");
    const resultBase64 = Buffer.from(resultBytes).toString("base64");

    return {
      success: true,
      dataUrl: `data:image/png;base64,${resultBase64}`,
    };
  });
