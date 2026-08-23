import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { createStartHandler, StartServer } from "@tanstack/react-start/server";
import { defineHandlerCallback, renderRouterToString } from "@tanstack/react-router/ssr/server";
import { jsx } from "react/jsx-runtime";
import { renderErrorPage } from "./lib/error-page";
import { callRemoveBgCloudApi } from "./lib/serverRemoveBg";

const renderHandler = defineHandlerCallback(async ({ router, responseHeaders }) => {
  try {
    return await renderRouterToString({
      router,
      responseHeaders,
      children: jsx(StartServer, { router }),
    });
  } catch (err) {
    console.error("SSR RENDER ERROR:", err);
    throw err;
  }
});

const startHandler = createStartHandler(renderHandler);

async function handleApiRemoveBg(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "content-type": "application/json",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  // Enforce maximum payload size limit (35 MB)
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > 35 * 1024 * 1024) {
    return new Response(JSON.stringify({ error: "Payload exceeds maximum allowed size (35MB)" }), {
      status: 413,
      headers: {
        "content-type": "application/json",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let imageBuffer: ArrayBuffer | Uint8Array;
    let size = "auto";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("image_file") || formData.get("file");
      if (formData.has("size")) {
        const rawSize = String(formData.get("size"));
        size = ["auto", "preview", "full", "regular", "medium", "hd", "4k"].includes(rawSize)
          ? rawSize
          : "auto";
      }

      if (!file || typeof file === "string") {
        return new Response(JSON.stringify({ error: "No image file provided" }), {
          status: 400,
          headers: {
            "content-type": "application/json",
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
      imageBuffer = await (file as Blob).arrayBuffer();
    } else if (contentType.includes("application/json")) {
      const json = (await request.json()) as { imageBase64?: string; size?: string };
      if (!json.imageBase64 || typeof json.imageBase64 !== "string") {
        return new Response(JSON.stringify({ error: "Missing or invalid imageBase64 field" }), {
          status: 400,
          headers: {
            "content-type": "application/json",
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
      if (json.size && typeof json.size === "string") {
        size = ["auto", "preview", "full", "regular", "medium", "hd", "4k"].includes(json.size)
          ? json.size
          : "auto";
      }
      const base64Data = json.imageBase64.includes(",")
        ? json.imageBase64.split(",")[1]
        : json.imageBase64;
      const binaryStr = atob(base64Data);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      imageBuffer = bytes;
    } else {
      imageBuffer = await request.arrayBuffer();
    }

    if (!imageBuffer || imageBuffer.byteLength === 0) {
      return new Response(JSON.stringify({ error: "Empty image payload" }), {
        status: 400,
        headers: {
          "content-type": "application/json",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    const outputBytes = await callRemoveBgCloudApi(imageBuffer, size);

    if (!outputBytes) {
      return new Response(
        JSON.stringify({
          error: "Cloud background removal API unavailable. Use client-side neural engine.",
        }),
        {
          status: 503,
          headers: {
            "content-type": "application/json",
            "X-Content-Type-Options": "nosniff",
          },
        },
      );
    }

    return new Response(outputBytes, {
      status: 200,
      headers: {
        "content-type": "image/png",
        "cache-control": "no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    const rawMessage = err instanceof Error ? err.message : "Background removal service error";
    // Sanitize error message to prevent internal system or path leakage
    const cleanMessage = rawMessage.replace(
      /\b(sk_[a-zA-Z0-9_-]+|sb_[a-zA-Z0-9_-]+)\b/g,
      "[REDACTED]",
    );
    return new Response(JSON.stringify({ error: cleanMessage }), {
      status: 500,
      headers: {
        "content-type": "application/json",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  const err = consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`);
  console.error(err);
  console.error("DEBUG SSR Response:", response.status, body);
  return new Response(renderErrorPage(err), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env?: unknown, ctx?: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/removebg" || url.pathname === "/api/remove-bg") {
        return await handleApiRemoveBg(request);
      }

      const response = await startHandler(request);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error("SERVER CATCH ERROR:", error);
      const err = error instanceof Error ? error : new Error(String(error));
      return new Response(renderErrorPage(err), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
