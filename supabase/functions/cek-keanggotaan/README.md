# F1: Edge Function cek-keanggotaan (Deno)

Lookup NIM → kartu keanggotaan. Tabel `anggota` di-RLS total; hanya
service_role di server ini yang membaca. NIM tidak pernah dikembalikan.

## Endpoint

```
POST {SUPABASE_URL}/functions/v1/cek-keanggotaan
Content-Type: application/json
apikey: {ANON_KEY}
{ "nim": "2210512345" }
```

## Response

- 200 `{ found: true, member: {...} }` — tanpa field `nim`
- 404 `{ found: false, message }` — seragam (tidak ditemukan / nonaktif)
- 400 `{ found: false, error: 'invalid_input' }`
- 429 `{ found: false, error: 'rate_limited' }` + Retry-After
- 500 `{ found: false, error: 'server_error' }`
- `Cache-Control: no-store`, CORS untuk origin situs.

## Env (supabase secrets)

- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — otomatis tersedia ke Functions

## Rate limit

10 request / menit per hash(IP), dicatat ke tabel `penggunaan_lookup`.
