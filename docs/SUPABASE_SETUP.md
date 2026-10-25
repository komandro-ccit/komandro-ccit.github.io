# Setup Kartu Keanggotaan (Supabase)

Panduan setup backend untuk fitur Kartu Keanggotaan Digital (`/members`).
PRD lengkap: [`PRD-KARTU-ANGGOTA.md`](./PRD-KARTU-ANGGOTA.md).

## 1. Buat Project Supabase (free tier cukup)

1. Daftar di [supabase.com](https://supabase.com) → **New project** (nama mis. `komandro-membership`).
2. Catat dari **Settings → API**:
   - `Project URL` → `PUBLIC_SUPABASE_URL`
   - `anon public` key → `PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (rahasia, JANGAN pernah ke client)

## 2. Jalankan Migration

Dari dashboard: **SQL Editor** → paste & run file-file berikut secara berurutan:

```
supabase/migrations/20261025000001_create_anggota.sql   → tabel + RLS
supabase/migrations/20261025000002_rls_and_storage.sql  → bucket foto + policy
```

Atau via CLI: `supabase db push`.

**Verifikasi RLS:** jalankan di SQL Editor:

```sql
select * from pg_policies where tablename = 'anggota';
-- Harus mengembalikan 0 baris (tidak ada policy anon)
```

## 3. Deploy Edge Function

```bash
supabase link --project-ref <project-ref>
supabase functions deploy cek-keanggotaan --no-verify-jwt
```

Tabel `anggota` di proteksi RLS; Edge Function membaca pakai service role.

**Uji cepat:**

```bash
curl -X POST "https://<project-ref>.supabase.co/functions/v1/cek-keanggotaan" \
  -H "Content-Type: application/json" \
  -H "apikey: <ANON_KEY>" \
  -d '{"nim":"2210512345"}'
```

Response yang diharapkan: `{"found": false, ...}` (belum ada datanya) — **bukan 500/permission error**.

## 4. Konfigurasi Situs

### Lokal

```bash
cp .env.example .env
# isi 3 variabel di .env
```

### Production (GitHub Pages)

Tambahkan **repository secrets** di GitHub
(`Settings → Secrets and variables → Actions`):

| Secret | Nilai |
|---|---|
| `PUBLIC_SUPABASE_URL` | Project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | anon key |

Lalu **tambahkan env ke workflow** `.github/workflows/deploy.yml`:

```yaml
      - name: Build
        run: npm run build
        env:
          PUBLIC_SUPABASE_URL: ${{ secrets.PUBLIC_SUPABASE_URL }}
          PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PUBLIC_SUPABASE_ANON_KEY }}
```

**Tanpa env, halaman `/members` tetap hidup** — form menampilkan notice
"layanan maintenance" dan tidak crash.

## 5. Import Data Anggota

File `.env` sudah berisi `SUPABASE_SERVICE_ROLE_KEY`, siapkan CSV:

```csv
nim,nama,angkatan,jurusan,program,status,foto
2210512345,Citra Maharani,2024,D3 Teknologi Komputer,Bootcamp 2024 — Mobile Development,aktif,foto/citra.gif
2210512346,Joko Prasetyo,2024,Sistem Informasi,,aktif,
```

- `foto`: path file lokal (jpg/png/gif/webp) atau URL — opsional.
- `status`: `aktif` | `alumni` | `nonaktif` — default `aktif`.

Jalankan:

```bash
npm run seed:anggota -- roster.csv
```

Script ini **idempotent** (upsert by NIM) dan akan mencetak ringkasan
import/skip/error per baris. Foto diupload otomatis ke bucket `foto-anggota`.

## 6. Verifikasi End-to-End

1. Buka `/members` → isi NIM valid → kartu muncul.
2. Isi NIM asal (sembarang 10 digit) → pesan "NIM tidak terdaftar".
3. Buka `/members/verify?id=KMD-2024-0042` → halaman verifikasi.
4. Scan QR di kartu → terbuka halaman verifikasi berisi ID kartu.

## Catatan Free Tier

- Supabase free tier **pause setelah 1 minggu tidak ada traffic**. Situs sudah
  jadi traffic agent, tapi kalau situs sepi: pasang cron (GitHub Action ping 1×/minggu) atau upgrade ke Pro.
- RLS membuat tabel tidak bisa dibaca dari browser dengan anon key. Akses hanya
  lewat Edge Function.
