import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { callRemoveBgCloudApi } from "./lib/serverRemoveBg";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

async function handleApiRemoveBg(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
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
        size = String(formData.get("size"));
      }

      if (!file || typeof file === "string") {
        return new Response(JSON.stringify({ error: "No image file provided" }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }
      imageBuffer = await (file as Blob).arrayBuffer();
    } else if (contentType.includes("application/json")) {
      const json = (await request.json()) as { imageBase64?: string; size?: string };
      if (!json.imageBase64) {
        return new Response(JSON.stringify({ error: "Missing imageBase64 field" }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }
      if (json.size) size = json.size;
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

    const outputBytes = await callRemoveBgCloudApi(imageBuffer, size);

    return new Response(outputBytes, {
      status: 200,
      headers: {
        "content-type": "image/png",
        "cache-control": "no-cache",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Background removal failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
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

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
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
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/removebg" || url.pathname === "/api/remove-bg") {
        return await handleApiRemoveBg(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
