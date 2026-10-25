// deno-lint-ignore-file no-explicit-any
// Edge Function: cek-keanggotaan
// Deploy: supabase functions deploy cek-keanggotaan --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const NIM_PATTERN = /^\d{10,11}$/;
const RATE_LIMIT = 10;          // max request
const RATE_WINDOW_S = 60;       // per this many seconds
const FOTO_URL_TTL_S = 300;     // signed URL TTL: 5 menit

const ALLOWED_ORIGINS = [
  "https://komandro-ccit.github.io",
  "http://localhost:4350",
  "http://127.0.0.1:4350",
];

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
};

function json(payload: any, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...extraHeaders },
  });
}

function normalizeNim(raw: unknown): string {
  return String(raw ?? "").replace(/[\s\-_.]/g, "").toUpperCase();
}

async function hashText(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("cf-connecting-ip")
    ?? "unknown";
}

async function isRateLimited(ip: string): Promise<boolean> {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const ipHash = await hashText(ip);
  const windowStart = new Date(Date.now() - RATE_WINDOW_S * 1000).toISOString();

  const { count, error } = await supabase
    .from("penggunaan_lookup")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);
  if (error) return false; // fail-open: jangan blokir lookup karena error internal

  if ((count ?? 0) >= RATE_LIMIT) return true;

  await supabase.from("penggunaan_lookup").insert({ ip_hash: ipHash });
  return false;
}

async function cardIdFor(angkatan: number, nomorUrut: number | null): Promise<string> {
  const n = nomorUrut ?? 0;
  return `KMD-${angkatan}-${String(n).padStart(4, "0")}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ found: false, error: "invalid_input" }, 400);

  // CORS dinamis sederhana: mirror origin bila diizinkan
  const origin = req.headers.get("origin") ?? "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  const started = Date.now();
  const respond = async (payload: any, status: number, extraHeaders: Record<string, string> = {}) => {
    // Anti timing-oracle: pastikan berjalan minimal 120 ms
    const elapsed = Date.now() - started;
    if (elapsed < 120) await new Promise((r) => setTimeout(r, 120 - elapsed));
    return json(payload, status, extraHeaders);
  };

  try {
    const body = await req.json().catch(() => null);
    const nim = normalizeNim(body?.nim);

    if (!NIM_PATTERN.test(nim)) {
      return await respond({ found: false, error: "invalid_input" }, 400);
    }

    const ip = clientIp(req);
    if (await isRateLimited(ip)) {
      return await respond(
        { found: false, error: "rate_limited" },
        429,
        { "Retry-After": String(RATE_WINDOW_S) },
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .from("anggota")
      .select("nama, angkatan, jurusan, status, program, foto_path, foto_tipe, nomor_urut")
      .eq("nim", nim)
      .eq("status", "aktif")
      .maybeSingle();

    if (error) return await respond({ found: false, error: "server_error" }, 500);

    // Tidak ditemukan ATAU nonaktif -> response seragam (anti-enumeration)
    if (!data) {
      return await respond(
        { found: false, message: "NIM tidak terdaftar sebagai anggota Komandro." },
        404,
      );
    }

    let fotoUrl: string | null = null;
    if (data.foto_path) {
      const { data: signed } = await supabase.storage
        .from("foto-anggota")
        .createSignedUrl(data.foto_path, FOTO_URL_TTL_S);
      fotoUrl = signed?.signedUrl ?? null;
    }

    return await respond({
      found: true,
      member: {
        nama: data.nama,
        angkatan: data.angkatan,
        jurusan: data.jurusan,
        status: data.status,
        program: data.program,
        fotoUrl,
        fotoTipe: data.foto_tipe,
        cardId: await cardIdFor(data.angkatan, data.nomor_urut),
      },
    });
  } catch {
    return await respond({ found: false, error: "server_error" }, 500);
  }
});
