import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://dnfufsgiesgxyewaghnv.supabase.co";
const DEFAULT_KEY = "sb_publishable_FF1oGi5a0qnljv1HtpZRzw_2vohsy8f";

function getValidUrl(val: unknown): string | null {
  if (typeof val !== "string") return null;
  const trimmed = val.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      new URL(trimmed);
      return trimmed;
    } catch {
      return null;
    }
  }
  return null;
}

function getValidKey(val: unknown): string | null {
  if (typeof val !== "string") return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const SUPABASE_URL =
  getValidUrl(
    typeof import.meta !== "undefined" ? import.meta.env?.VITE_SUPABASE_URL : undefined,
  ) ||
  getValidUrl(typeof process !== "undefined" ? process.env?.VITE_SUPABASE_URL : undefined) ||
  getValidUrl(typeof process !== "undefined" ? process.env?.SUPABASE_URL : undefined) ||
  DEFAULT_URL;

export const SUPABASE_ANON_KEY =
  getValidKey(
    typeof import.meta !== "undefined" ? import.meta.env?.VITE_SUPABASE_ANON_KEY : undefined,
  ) ||
  getValidKey(typeof process !== "undefined" ? process.env?.VITE_SUPABASE_ANON_KEY : undefined) ||
  getValidKey(typeof process !== "undefined" ? process.env?.SUPABASE_ANON_KEY : undefined) ||
  DEFAULT_KEY;

const isBrowser = typeof window !== "undefined";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
    detectSessionInUrl: isBrowser,
  },
});
