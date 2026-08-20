export type ToolStatus = "idle" | "selected" | "processing" | "success" | "error";

export interface ImageMeta {
  name: string;
  size: number;
  width: number;
  height: number;
  type: string;
}

export interface SelectedImage {
  file: File;
  url: string; // object URL
  meta: ImageMeta;
}

export interface ProcessedResult {
  blob: Blob;
  url: string;
}
