/** Konfigurasi Supabase sisi client — hanya nilai publik. */

export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Endpoint Edge Function cek-keanggotaan; '' kalau belum dikonfigurasi. */
export function cekKeanggotaanEndpoint(): string {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return '';
  return `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/cek-keanggotaan`;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(cekKeanggotaanEndpoint());
}

export interface MemberPayload {
  nama: string;
  angkatan: number;
  jurusan: string;
  status: 'aktif' | 'alumni' | 'nonaktif';
  program: string | null;
  fotoUrl: string | null;
  fotoTipe: string | null;
  cardId: string;
}

export type LookupResult =
  | { kind: 'found'; member: MemberPayload }
  | { kind: 'not_found' }
  | { kind: 'invalid' }
  | { kind: 'rate_limited' }
  | { kind: 'server_error' };
