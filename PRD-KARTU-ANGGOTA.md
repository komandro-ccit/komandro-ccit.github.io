# PRD — Kartu Keanggotaan Digital Komandro CCIT-FTUI

| Field | Detail |
|---|---|
| **Dokumen** | Product Requirements Document — Kartu Keanggotaan Digital (Digital Membership Card) |
| **Versi** | 1.0 (Draft untuk review) |
| **Tanggal** | 2026-10-25 |
| **Owner** | Tim Komandro CCIT-FTUI (web) |
| **Status** | Draft — menunggu approval scope & keputusan open questions |
| **Produk** | Website Komandro CCIT-FTUI (`komandro-ccit.github.io`) |
| **Stack** | Astro 4 (static) + Tailwind CSS 3 + MDX + Mermaid, deploy GitHub Pages |
| **Backend** | Supabase (Postgres + Edge Functions + Storage) — baru, satu-satunya dependensi runtime |
| **Dokumen terkait** | `PRD-REDESIGN.md` (redesign visual, sudah diimplementasikan), `DESIGN-SPEC.md` (Konsep D "Campus Pop" — sistem desain aktif) |

---

## 1. Ringkasan Eksekutif

Komandro CCIT-FTUI sudah punya **kartu fisik** untuk anggota yang telah lulus bootcamp — bukti keanggotaan yang dipakai saat event, workshop, atau saat crop-in di kalender.
Butuh **digitalisasi** supaya kartu itu bisa diverifikasi kapan saja, dar mana saja, dan tanpa hilang di dompet.

Proposal: **halaman `/members` yang berfungsi ganda**:

1. **Verifikasi** — anggota (atau siapa pun) mengetik **NIM** → sistem mengembalikan **kartu keanggotaan digital** berisi nama, angkatan, jurusan, status, foto, dan **QR code** sebagai token verifikasi.
2. **Kartu resmi** — tampilan kartu yang terlihat seperti kartu keanggotaan fisik (bukan sekadar tabel), bisa di-*screenshot*/dicetak, dan QR-nya bisa discan untuk verifikasi keaslian.

**Kenapa "kartu", bukan "cek status"?** Karena nilai dari fitur ini bukan pada jawaban "ya dia anggota", tapi pada **credential yang bisa dibuktikan**: satu kartu dengan QR, satu ID, satu sumber kebenaran. UI harus terasa seperti *membership card*, bukan seperti form search generik.

### 1.1 Prinsip Panduan

| Prinsip | Arti |
|---|---|
| **Kartu dulu, form kemudian** | Layar pertama yang dilihat user adalah *contoh kartu*, baru formnya. Orang harus tahu bentuk "bukti" sebelum diminta NIM. |
| **Privasi NIM** | NIM tidak pernah masuk repo publik, tidak pernah dikirim ke server tanpa need, dan tidak bisa di-enumerate. |
| **Output public, input private** | Yang dipublikasikan: nama, angkatan, jurusan, status, foto. Yang dirahasiakan: NIM, email, kontak pribadi. |
| **Static tetap static** | Situs tetap `output: 'static'` di GitHub Pages. Tidak pindah hosting, tidak perlu server SSR. |
| **Satu sumber kebenaran** | Data anggota hanya hidup di Supabase. Repo hanya menyimpan kode + seed script. |

### 1.2 Out of Scope (tahap 1)

- Autentikasi / login anggota, dashboard anggota, riwayat Point.
- Program loyalty / gamification poin.
- Verifikasi batch lewat WhatsApp / diverifikasi admin manual (verifikasi self-service saja).
- Integrasi ke SIGMA / SIMA FTUI (data oficiales UI).
- Papan leaderboard / ranking.
- Notifikasi email (e.g. "kartu kamu diperbarui").
- Multi-tenant / multi-komunitas (satu komunitas saja).
- Dark mode (K2, sudah konsisten dengan keputusan redesign sebelumnya).

---

## 2. Latar Belakang & Masalah

### 2.1 Kondisi saat ini

| Aspek | Temuan |
|---|---|
| **Data anggota** | Tidak ada. `src/data/members.json` hanya berisi **5 pengurus aktif** (nama + role + LinkedIn). `src/data/alumni/*.json` berisi **119 record alumni** dengan fields `id, name, role, batch, consent, currentPosition, contact, achievements` — **tanpa NIM, tanpa jurusan, tanpa foto**. |
| **Foto** | `public/images/alumni/` **kosong**. Semua record punya `consent: false`, sehingga `AlumniCard.astro` selalu render avatar fallback (DiceBear inisial). |
| **Runtime** | `astro.config.mjs` → `output: 'static'`. Deploy via `.github/workflows/deploy.yml` (build → `actions/upload-pages-artifact` → `actions/deploy-pages@v4`). **Tidak ada server runtime sama sekali.** |
| **API route** | Tidak ada `src/pages/api/`. Tidak ada `fetch()` ke backend eksternal mana pun di seluruh `src/`. |
| **Handling secrets** | `.gitignore` sudah meng-ignore `.env` & `.env.production`. `src/env.d.ts` ada tapi env yang dipakai hanya `import.meta.env.BASE_URL`. |
| **Pola data** | `import.meta.glob('/src/data/alumni/*.json', { eager: true })` di `src/pages/alumni/[year].astro:26-40` — load semua file batch saat build. |

### 2.2 Masalah yang harus diselesaikan

| # | Masalah | Dampak |
|---|---|---|
| P1 | **NIM tidak ada di data mana pun.** Sumber roster belum ditentukan. | Fitur tidak bisa dibangun sebelum ada sumber data. |
| P2 | **Situs static tanpa server.** Tidak bisa query database dari build. | Butuh backend eksternal → Supabase. |
| P3 | **NIM = data pribadi.** Repo ini publik di GitHub Pages/GitHub. | NIM polos di JSON = kebocoran data seluruh anggota. |
| P4 | **NIM FTUI prediktabel** (10–11 digit, format terbatas). | Endpoint lookup tanpa proteksi bisa di-enumerate → mass data leak. |
| P5 | **Foto butuh hosting.** `.gitignore` meng-ignore `*.jpg`/`.png` di luar `public/images/**`. | Repo bisa menyimpan foto, tapi membengkakkan repo & butuh PR tiap menambah orang. |
| P6 | **Halaman `/members` sudah ada** — berisi daftar **5 pengurus aktif** (nav label "Anggota"). | Konflik rute: halaman lama harus digabung/berpindah, URL `/members` tidak boleh broken (PRD-REDESIGN §1.1: URL existing 100% backward-compatible). |

### 2.3 Referensi & Konteks Kompetitif

| Produk | Pola yang dipakai | Yang kita ambil |
|---|---|---|
| **Kartu Membership digital** (mis. kartu IEEE/ISOC, Kaggle, GitHub Sponsors, kartu kampus) | kartu, QR di satu sudut, ID mono-font, gradient accent | kartu + QR + ID + gradient accent sesuai warna status/angkatan |
| **Open Campus / Student ID digital** | lookup by NIM, kartu langsung tampil | alur: input NIM → kartu |
| **Supabase** | Postgres + RLS + Edge Functions + Storage | backend utama |

---

## 3. Tujuan & Sasaran

### 3.1 Tujuan

| ID | Tujuan | Ukuran |
|---|---|---|
| G1 | Anggota bisa memverifikasi keanggotaannya kapan saja dalam ≤ 30 detik | Form NIM → kartu tampil, tanpa scroll, satu halaman |
| G2 | Kartu harus terlihat **resmi** & layak dibagikan (screenshot/print) | Kartu pass design review (owner) + bisa print A6/CR80 landscape |
| G3 | NIM & data sensitif anggota tidak terekspos publik | Nol NIM di repo publik; endpoint menolak enum |
| G4 | Admin bisa menambah/memperbarui anggota tanpa menyentuh kode | CLI/import script + Supabase Studio |
| G5 | Fitur ini tidak merusak halaman `/members` yang sudah ada | Tidak ada broken link; navigasi tetap jelas |

### 3.2 Non-Tujuan

- Bukan Direktori Anggota publik yang bisa di-browse (nama + jurusan + foto semua orang terbuka). **Lookup wajib by NIM.**
- Bukan pengganti ID card resmi FTUI.
- Tidak menambah backend untuk fitur lain (tidak ada CMS umum).

### 3.3 Metrik Success (target 1 bulan setelah GA)

| Metrik | Target | Cara ukur |
|---|---|---|
| Success rate lookup | ≥ 95% input valid menghasilkan kartu | log Edge Function (tanpa log NIM mentah) |
| P95 latency response | ≤ 800 ms (diukur di Edge Function) | Supabase logs |
| Error rate (404 / NIM tidak ditemukan) | ≤ 15% dari total request | log |
| Success rate import seed | 100% record ter-import, 0 duplikat | hasil `npm run seed:anggota` |
| P0/P1 bug setelah GA | 0 | issue tracker |

---

## 4. Target Pengguna & Use Case

| Persona | Kebutuhan | Use case utama |
|---|---|---|
| **Anggota aktif** (P1) | Bukti keanggotaan untuk acara/workshop | buka `/members` → ketik NIM → **tampilkan kartu** → screenshot / scan QR |
| **Alumni** (P2) | Konfirmasi status tetap anggota, akses benefit lama | sama |
| **Organizer / pemateri** (P3) | Cek cepat peserta mana yang valid | buka `/members` → input NIM → konfirmasi nama + angkatan + status |
| **Calon anggota** (P4) | Lihat bentuk kartu, mau gabung | lihat **contoh kartu** di halaman → CTA gabung |
| **Admin** (P5) | Tambah/update/hapus anggota, upload foto | Supabase Studio + `npm run seed:anggota` |
| **Pengunjung** (P6) | Penasaran | lihat halaman, tidak punya NIM → butuh instructions jelas |

### 4.1 User Story (format As a / I want / So that)

**US-1 — Verifikasi**
> Sebagai anggota, saya ingin mengetik NIM saya dan langsung melihat kartu keanggotaan saya, sehingga saya bisa membuktikan keanggotaan saya di mana saja.

**US-2 — Bukti yang bisa dibagikan**
> Sebagai anggota, saya ingin kartu saya terlihat resmi dan memiliki QR code, sehingga orang lain bisa memverifikasi keasliannya.

**US-3 — Konfirmasi oleh orang lain**
> Sebagai organizer, saya ingin memindai QR kartu anggota dan melihat konfirmasi keaslian, sehingga saya tidak menerima orang yang tidak terdaftar.

**US-4 — Ketenangan data**
> Sebagai anggota, saya ingin NIM dan data pribadi saya tidak terekspos publik, sehingga saya tidak dirugikan.

**US-5 — Administrasi mudah**
> Sebagai admin, saya ingin mengimpor daftar anggota dari CSV dan memperbarui foto tanpa menyentuh kode, sehingga pemeliharaan cepat.

**US-6 — Kejelasan saat gagal**
> Sebagai pengguna, saya ingin pesan yang jelas kalau NIM tidak ditemukan, sehingga saya tahu harus menghubungi siapa.

---

## 5. Solusi & Arsitektur

### 5.1 Diagram Arsitektur

```
┌────────────────────────────────────────────────────────────┐
│  GitHub Pages (static, Astro build)                        │
│  /members → KartuMember.astro + Formulir NIM (vanilla JS)  │
│  data default ter-embed (dummy, non-reveal)                │
└───────────────┬────────────────────────────────────────────┘
                │  POST { nim }  (no API key di client!)
                ▼
┌────────────────────────────────────────────────────────────┐
│  Supabase Edge Function  /functions/v1/cek-keanggotaan     │
│  1. Validasi input (format NIM 10–11 digit)                │
│  2. Rate limit per IP (DB table / Upstash)                 │
│  3. SELECT anggota WHERE nim = $1  (service role)          │
│  4. Generate signed URL foto (TTL 5 menit)                 │
│  5. Return subset fields (tanpa NIM)                       │
└───────────────┬────────────────────────────────────────────┘
                │  service_role key (server-side only)
                ▼
┌────────────────────────────────────────────────────────────┐
│  Supabase Postgres + Storage                                │
│  tabel anggota (RLS: tolak semua untuk anon)                │
│  bucket foto (private)                                      │
└────────────────────────────────────────────────────────────┘
```

### 5.2 Kenapa Supabase (dan kenapa bukan alternatif)

| Alternatif | Kenapa tidak |
|---|---|
| Simpan JSON di repo | Repo publik → NIM bocor (P3), update butuh PR, repo membengkak (P5). |
| Google Sheets + Apps Script | API key bocor di browser, kuota &(latency) poor, tidak ada storage foto yang rapi, tidak ada RLS. |
| Firebase | Firestore query butuh rules yang fiddly, storage belum matured, vendor lock-in tanpa keunggulan khusus. |
| API custom (Vercel/Cloudflare Worker) | Butuh 2 infra (DB + API). Supabase memberi DB + API + Storage + Auth dalam 1 tempat. |
| **Supabase** | ✅ Postgres matang (bisa query, index, RLS), ✅ Edge Functions (Deno, gratis untuk volume kecil), ✅ Storage untuk foto, ✅ CLI + Studio untuk admin, ✅ Row Level Security matang → data NIM tidak bisa dibaca anon. |

### 5.3 Skema Database

```sql
-- Extension untuk UUID
create extension if not exists "pgcrypto";

-- Tabel anggota
create table public.anggota (
  id           uuid primary key default gen_random_uuid(),
  nim          text        not null unique,
  nama         text        not null,
  angkatan     int         not null,
  jurusan      text        not null,
  status       text        not null default 'aktif'
                 check (status in ('aktif', 'alumni', 'nonaktif')),
  program      text,              -- mis. "Bootcamp 2024 — Mobile Development"
  bootcamp     text,              -- mis. "Android 2024" / "Web 2024"
  foto_path    text,              -- path di Storage, BUKAN url publik
  foto_tipe    text default 'jpg' check (foto_tipe in ('jpg','jpeg','png','gif','webp')),
  angkatan_lulus int,             -- nullable; diisi kalau status alumni
  dibuat_pada   timestamptz not null default now(),
  diperbarui_pada timestamptz not null default now()
);

create index anggota_nim_idx on public.anggota (nim);
create index anggota_angkatan_idx on public.anggota (angkatan);

-- RLS: matikan akses anon sepenuhnya (hanya service_role / Edge Function)
alter table public.anggota enable row level security;

-- Tidak ada policy untuk anon => seluruh akses anon ditolak.
-- (Pengecekan otomatis: UI Supabase "Data API" harus menunjukkan 0 policy untuk anon.)

-- Tabel rate limit (opsional, alternatif: Upstash Redis)
create table public.penggunaan_lookup (
  id         bigint generated always as identity primary key,
  ip_hash    text        not null,
  created_at timestamptz not null default now()
);
create index penggunaan_lookup_ip_idx on public.penggunaan_lookup (ip_hash, created_at desc);
```

**Catatan desain `foto_path`:** path disimpan relatif (mis. `anggota/2024/2210512345.jpg`), bukan signed URL — karena signed URL punya TTL dan akan kedaluwarsa. Frontend meminta signed URL baru setiap lookup.

### 5.4 Bucket Storage

| Atribut | Nilai | Alasan |
|---|---|---|
| Nama bucket | `foto-anggota` | — |
| Public | **false** (private) | Mencegah URL foto bocor & bisa diubah tanpa izin |
| Allowed MIME | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | JPG/GIF sesuai requirement |
| Max file size | 2 MB | cukup untuk foto & gif pendek |
| Path convention | `anggota/<angkatan>/<nim>.<ext>` | terorganisasi, unik |

### 5.5 Edge Function

**Nama:** `cek-keanggotaan`
**Path:** `supabase/functions/cek-keanggotaan/index.ts`

**Request:**
```json
POST {SUPABASE_URL}/functions/v1/cek-keanggotaan
Content-Type: application/json
{ "nim": "2210512345" }
```

**Response sukses (200):**
```json
{
  "found": true,
  "member": {
    "nama": "Ahmad Faizul Hakim",
    "angkatan": 2024,
    "jurusan": "Teknik Informatika",
    "status": "aktif",
    "program": "Bootcamp 2024 — Mobile Development",
    "fotoUrl": "https://...signed-url...",
    "fotoTipe": "jpg",
    "cardId": "KMD-2024-0123"
  }
}
```

**Response tidak ditemukan (404):**
```json
{ "found": false, "message": "NIM tidak terdaftar sebagai anggota Komandro." }
```

**Response error (400 / 429 / 500):**
```json
{ "found": false, "error": "invalid_input" | "rate_limited" | "server_error" }
```

**Aturan:**
- Response **tidak pernah** menyertakan NIM (bahkan saat sukses) → mengurangi risiko shoulder-surfing & screenshot.
- `found: false` **tidak** membocorkan apakah NIM "ada tapi status nonaktif" vs "tidak ada" — untuk status `nonaktif`, tetap balas `found: false` dengan pesan generik. (Alternatif: pesan "keanggotaan tidak aktif" — **open question OQ-3**.)
- Input di-trim, di-normalisasi (uppercase, hapus spasi/tanda hubung), divalidasi dengan regex `^\d{10,11}$`.
- Selalu `Cache-Control: no-store`.

### 5.6 Rate Limit & Anti-Brute-Force

NIM 10–11 digit → ruang pola masih besar, tapi endpoint harus tetap tahan enumerate.

| Kontrol | Detail |
|---|---|
| Rate limit per IP | Maks **10 request / menit** per IP hash. |
| Backoff | 429 + `Retry-After`. |
| Honey pot | NIM dengan checksum tidak valid (mis. prefix FTUI yang tak dipakai) → 404 dengan latency sama (tidak ada timing oracle). |
| Tidak ada endpoint list | Tidak ada endpoint yang mengembalikan daftar. |
| Log minimal | Log `hash(ip)`, `hash(nim)`, timestamp, hasil. **Jangan log NIM mentah.** |
| Observability | Row counter `penggunaan_lookup` per hari untuk deteksi anomali. |

### 5.7 Sisi Client (static)

```
src/pages/members.astro         ← Halaman utama /members (ganti isi, ganti → /pengurus)
src/components/MemberCard.astro  ← Kartu keanggotaan (visual)
src/components/MemberLookupForm.astro ← Form NIM + state UI
src/data/anggota-demo.ts        ← Data contoh (nama fiktif, NIM fiktif, foto dummy)
```

**Alur client:**
1. Halaman load → tampilkan **kartu contoh** (dummy) + form NIM.
2. User input NIM → validasi client-side (10–11 digit) → POST ke Edge Function.
3. Sukses → render `<MemberCard>` dengan data asli (foto dari signed URL).
4. Gagal → tampilkan kartu dengan **state "tidak ditemukan"** (lock icon, pesan ramah).
5. Tombol "Salin ID" + tombol "Unduh kartu" (PNG via canvas, opsional) — **open question OQ-4**.

**Fallback saat Supabase down / env belum diisi:**
Form menampilkan pesan: *"Layanan verifikasi sedang dalam pemeliharaan. Untuk konfirmasi manual, hubungi @komandro_ccit."* — **tidak** crash, **tidak** menampilkan data dummy seolah-olah asli.

### 5.8 Env & Secrets

| Key | Lokasi | Dipakai |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | GitHub Actions secret + `.env` lokal | Edge Function endpoint URL |
| `PUBLIC_SUPABASE_ANON_KEY` | GitHub Actions secret + `.env` lokal | header `apikey` (Edge Function memverifikasi JWT-nya sendiri) |
| `SUPABASE_SERVICE_ROLE_KEY` | **hanya** di Supabase dashboard / Edge Function env | query tabel (tidak pernah di client, tidak pernah di repo) |

> **Penting:** `PUBLIC_*` prefix berarti nilainya akan ter-bundle ke JS client. Ini **aman** untuk anon key (desainnya memang publik), selama **RLS ketat** + data sensitif tidak bisa diakses via anon key. **Service role key tidak boleh punya prefix `PUBLIC_`** dan tidak boleh muncul di kode client.

**GitHub Actions:** tambahkan secret di repo settings (`SUPABASE_URL`, `SUPABASE_ANON_KEY`). Site tetap static — hanya butuh 2 env var saat build.

---

## 6. Requirements & Acceptance Criteria

### 6.1 Functional — Lookup

| ID | Requirement | Acceptance criteria |
|---|---|---|
| F1 | User dapat mengetik NIM dan mendapatkan kartu | Input NIM valid 10–11 digit + submit → kartu ter-render dengan nama, angkatan, jurusan, status, program, foto, ID kartu, QR — **tanpa reload halaman** |
| F2 | NIM tidak ditemukan | State error menampilkan pesan jelas + CTA hubungi admin; **tidak** menampilkan daftar/petunjuk NIM lain |
| F3 | NIM invalid (huruf, < 10 digit, > 11 digit) | Validasi client-side mencegah request; tampilkan_inline hint format |
| F4 | Input dinormalisasi | Spasi, tanda hubung, huruf besar otomatis diterima (`22-1051 2345` → works) |
| F5 | Loading state | Saat request in-flight: tombol disabled + spinner;mencegah double-submit |
| F6 | Service down / env kosong | Pesan fallback yang informatif, tidak crash, tidak menampilkan data palsu |
| F7 | Rate limit kena | 429 → pesan "Terlalu banyak percobaan, coba lagi sebentar lagi" |
| F8 | Keyboard & a11y | Form label terbaca screen reader; error_state diumumkan via `aria-live="polite"`; focus pindah ke kartu hasil |
| F9 | Mobile | Form & kartu utuh di 360px; tombol minimal 44px tinggi |

### 6.2 Functional — Kartu

| ID | Requirement | Acceptance criteria |
|---|---|---|
| C1 | Kartu menampilkan identitas | Nama, angkatan, jurusan, status, program, NIM **disembunyikan/mask** (opsional, OQ-5), ID kartu |
| C2 | QR code | QR berisi URL verifikasi kanonik, mis. `https://komandro-ccit.github.io/members/verify?id=KMD-2024-0123` — **tidak memuat NIM** |
| C3 | Foto | Menampilkan foto bila ada; fallback inisial bila tidak (konsisten `AlumniCard.astro`) |
| C4 | ID kartu unik & konsisten | Format `KMD-<angkatan>-<nomor urut>`; sama di DB, QR, dan tampilan |
| C5 | Status visual | Pill warna berbeda: `aktif` (mint), `alumni` (sky), `nonaktif` (neutral/abu) |
| C6 | Print | `@media print` → cetak kartu saja, warna latar dipertahankan (`print-color-adjust: exact`) |
| C7 | Copy | Tombol "Salin ID" menyalin ID kartu ke clipboard dengan feedback "Tersalin!" |

### 6.3 Functional — Verifikasi QR (tahap 1: minimal)

| ID | Requirement | Acceptance criteria |
|---|---|---|
| V1 | Halaman verifikasi | `/members/verify?id=KMD-2024-0123` menampilkan ringkasan kartu (nama, angkatan, status, program) |
| V2 | ID tidak dikenal | 404 friendly page dengan bahasa ID |
| V3 | QR dapat discan | QR konten = URL absolut `site` + path verify (base-aware, pakai `link()` helper) |

> **Catatan:** QR memuat **ID kartu**, bukan NIM. Jadi orang yang punya screenshot kartu tidak bisa menebak NIM.

### 6.4 Functional — Admin & Data

| ID | Requirement | Acceptance criteria |
|---|---|---|
| A1 | Import roster | `npm run seed:anggota -- file.csv` meng-import CSV (header: `nim,nama,angkatan,jurusan,program,status,foto`) |
| A2 | Idempotent | Import ulang file yang sama **tidak** membuat duplikat (upsert by `nim`) |
| A3 | Laporan | Script mencetak ringkasan: jumlah imported, skipped, duplikat, error per baris |
| A4 | Upload foto | Dua cara: (a) file lokal → Storage via CLI, (b) URL → download lalu upload |
| A5 | Validasi import | Baris dengan NIM tidak valid atau duplikat di file yang sama ditolak dengan pesan per baris |
| A6 | Edit member | Admin bisa edit via Supabase Studio (nama, jurusan, status, angkatan) |
| A7 | Deactivate | Set `status = 'nonaktif'` → lookup membalas `found: false` |

### 6.5 Non-Functional

| ID | Requirement | Acceptance criteria |
|---|---|---|
| N1 | Performa | Bundle JS tambahan ≤ 30 KB (gz); tidak ada framework JS; build time naik ≤ 5 detik |
| N2 | Tidak ada secret di client | Scan `dist/` → tidak ada `service_role` / `SUPABASE_SERVICE_ROLE_KEY` string |
| N3 | Tidak ada NIM di repo | `git grep -iE "nim"` di `src/` & `public/` → hanya dokumentasi/placeholder |
| N4 | Dependensi | Tambah minimal 1 dependency runtime (jika QR butuh generator) — pilih yang ringan |
| N5 | Browser support | Chrome/Edge/Firefox/Safari versi evergreen |
| N6 | Documentation | README + PROJECT_STRUCTURE diperbarui; cara setup Supabase terdokumentasi |
| N7 | Type safety | Skema tabel punya migration SQL yang versioned di `supabase/migrations/` |
| N8 | Error monitoring | Error Edge Function masuk Supabase logs; tidak fatal |

### 6.6 Privacy & Security (KRITIS)

| ID | Requirement | Acceptance criteria |
|---|---|---|
| S1 | RLS aktif | `select * from anggota` dengan anon key → 0 baris (dibuktikan lewat CLI check) |
| S2 | Tidak ada data sensitif di response | Response Edge Function tidak memuat field `nim`, `email`, atau field internal lain |
| S3 | Hash untuk log | Log memakai hash, bukan nilai mentah |
| S4 | Foto privat | Signed URL TTL ≤ 10 menit; bucket tidak public |
| S5 | Rate limit aktif | > 10 req/menit dari 1 IP → 429 |
| S6 | No enumeration | `found:false` seragam untuk "tidak ada" dan "nonaktif" (kecuali decided di OQ-3) |
| S7 | Consent foto | Kalau `foto_path` diisi tapi consent belum disetujui → tidak tampil. (**open question OQ-6**) |
| S8 | Timing | Response 404 dan 200 selisih waktu tidak mencolok (tidak ada timing oracle) |

---

## 7. UX & Desain (Konsep D "Campus Pop")

Mengikuti `DESIGN-SPEC.md` yang sudah diimplementasikan (redesign aktif di branch `redesign-ui`).

### 7.1 Struktur Halaman `/members`

> **Keputusan:** URL `/members` dipakai fitur ini. Halaman **"Anggota/Aktif"** yang sekarang (daftar 5 pengurus) **dipindahkan** ke `/pengurus`, dan nav item "Anggota" di Navbar diarahkan ke `/pengurus` agar tidak ambigu.

```
┌─ Navbar (pill, existing) ────────────────────────────────┐
├─ Hero                                                       │
│  badge: "Kartu Keanggotaan"  |  h1: "Kartu Keanggotaan"    │
│  sub: "Buktikan keanggotaanmu. Masukkan NIM untuk melihat  │
│        kartu digital resmi Komandro."                       │
├─ Preview kartu (dummy) + Form NIM  (side-by-side, md+)     │
│  ┌───────────────┐   ┌──────────────────────────────────┐ │
│  │  CONTOH KARTU │   │  [ input NIM ] [Cari Kartu ]      │ │
│  │  (dummy)      │   │  hint: "10–11 digit, contoh …"    │ │
│  │  QR dummy      │   │                                  │ │
│  └───────────────┘   └──────────────────────────────────┘ │
├─(state sukses) Kartu asli (besar, di atas form)           │
├─ "Kenapa perlu kartu digital?" (3 benefit cards)          │
├─ "Gabung" CTA band (existing pattern)                      │
└─ Footer (existing)                                         │
```

**Setelah sukses, form menyingkir ke bawah** (atau jadi compact) dan kartu menjadi fokus utama.

### 7.2 Desain Kartu

**Format:** kartu landscape (CR80 = 85.6 × 54 mm, rasio 1.585), responsive.

```
┌──────────────────────────────────────────────────────┐
│  ⚡ KOMANDRO CCIT-FTUI              [status pill]     │
│  ─────────────────────────────────────────────────   │
│                                                      │
│   ┌────────┐   Ahmad Faizul Hakim                   │
│   │  FOTO  │   Teknik Informatika · Angkatan 2024    │
│   │ 120px  │   Bootcamp 2024 — Mobile Development    │
│   └────────┘                                        │
│                                                      │
│                              KMD-2024-0123           │
│                              [QR 96px]               │
└──────────────────────────────────────────────────────┘
```

| Elemen | Spesifikasi |
|---|---|
| **Ukuran** | Landscape 85.6×54mm (print), `aspect-[1.585]` di layar; lebar max ~420px |
| **Background** | Gradient lembut `canvas → soft` + aksen warna batch (rotating palette: violet/pink/mint/sky/amber) + **blob blur** (konsisten `HeroBg.astro`) |
| **Tipografi** | Nama: `font-display` (Fredoka) `text-display-sm`;elnama lain: `text-body-sm`; ID: `font-mono` (JetBrains Mono) `text-[13px] tracking-wider` |
| **Foto** | 120×120px, `rounded-full` dengan ring putih 4px + shadow; fallback inisial (DiceBear / CSS) |
| **Status pill** | `Pill` component: `aktif`→mint, `alumni`→sky, `nonaktif`→neutral |
| **QR** | 96×96px, putih, `rounded-[12px]`, padding 8px; **tanpa NIM** |
| **ID kartu** | `font-mono`, tracking lebar; bisa di-copy |
| **Logo** | Tile ⚡ gradient ungu (konsisten Navbar/Footer) |
| **Border** | Tidak memakai border — kartu dibedakan lewat shadow + gradient (konsisten redesign) |
| **Print** | `@media print` → hanya kartu, `print-color-adjust: exact`, `@page { size: landscape; margin: 10mm }` |

### 7.3 Motion

| Interaksi | Efek |
|---|---|
| Kartu muncul setelah lookup | `opacity-0 translate-y-3` → `opacity-100 translate-y-0`, 400ms, `ease-bounce` |
| Hover kartu | `hover:-translate-y-1 hover:shadow-card-lg` (konsisten kartu lain) |
| Tombol submit | `active:scale-[.98]`; loading spinner |
| Copy ID | Feedback "Tersalin!" 2 detik (pola sama dgn blog copy-button) |
| `prefers-reduced-motion` | Semua transisi dimatikan (sudah ada di `Layout.astro`) |

### 7.4 Copy (Bahasa Indonesia)

| Elemen | Copy |
|---|---|
| Nav item | "Anggota" → **"Kartu Keanggotaan"** (label alternatif: "Kartu Saya") |
| Hero badge | "Kartu Keanggotaan" |
| H1 | "Kartu Keanggotaan Digital" |
| Sub | "Buktikan keanggotaanmu di Komandro. Masukkan NIM, dan kartu resmi kami akan muncul di layar ini." |
| Label input | "Nomor Induk Mahasiswa (NIM)" |
| Placeholder | "Contoh: 2210512345" |
| Tombol | "Cari Kartu" / "Sedang mencari…" |
| Hint | "NIM consisted 10–11 digit. Spasi dan tanda hubung otomatis diabaikan." |
| Sukses | "Kartu kamu ketemu!" |
| Tidak ditemukan | "NIM tidak terdaftar sebagai anggota Komandro. Kalau kamu yakin should've terdaftar, hubungi @komandro_ccit." |
| Invalid | "Format NIM belum benar. Masukkan 10–11 digit angka." |
| Rate limit | "Terlalu banyak percobaan. Coba lagi dalam satu menit ya." |
| Maintenance | "Layanan verifikasi sedang dalam pemeliharaan. Untuk konfirmasi manual, hubungi @komandro_ccit." |
| Copy button | "Salin ID" / "Tersalin!" |
| Halaman verify | "Kartu ini sah" / "Kartu tidak ditemukan" |

### 7.5 A11y

- `<form>` dengan `<label>` eksplisit, bukan placeholder-as-label.
- `aria-live="polite"` untuk status hasil (found/not-found/loading).
- `aria-busy` pada tombol saat request.
- Fokus dipindah ke heading kartu setelah hasil render.
- Kontras teks ≥ 4.5:1 (cek token `ink` di atas `canvas`).
- QR punya `aria-label` ("QR verifikasi kartu") + teks alternatif ID.
- Kartu bisa dibaca tanpa melihat gambar: semua info berupa teks nyata, bukan gambar.

---

## 8. Data & Operasional

### 8.1 Sumber Data Awal

Belum ditentukan — **open question OQ-1**. Kemungkinan besar: CSV/Google Sheet berisi roster bootcamp.

**Template CSV (header):**
```csv
nim,nama,angkatan,jurusan,program,status,foto
2210512345,Ahmad Faizul Hakim,2024,Teknik Informatika,Bootcamp 2024 — Mobile Development,aktif,anggota/2024/2210512345.jpg
```

### 8.2 Migrasi dari Data Alumni yang Ada

119 record alumni sudah ada tapi **tanpa NIM/jurusan/foto** → tidak bisa dipakai untuk lookup.

Pilihan (open question OQ-2):
- (a) Seed DB **hanya** dengan anggota aktif + bootcamp yang punya NIM.
- (b) Seed alumni juga, dengan NIM diisi terpisah (via batch import kedua).
- (c) Seed alumni dengan NIM kosong → tidak bisa dicari (data tetap tampil di halaman `/alumni` yang statis).

Rekomendasi: **(a)** dulu, dengan halaman `/alumni` tetap statis seperti sekarang.

### 8.3 Backups

`pg_dump` terjadwal (via Supabase dashboard / cron GitHub Action) → commit? **Tidak** — simpan di lokasi privat (drive organisasi). Dokumentasikan cara restore.

### 8.4 Monitoring

| Item | Tool |
|---|---|
| Edge Function logs | Supabase Dashboard → Functions → Logs |
| Error rate | Query `penggunaan_lookup` harian |
| Uptime | UptimeRobot / GitHub Action ping (opsional) |
| Client-side error | `window.onerror` → console only (tahap 1, tidak perlu Sentry) |

---

## 9. Struktur File

```
supabase/
├── config.toml                       # Supabase CLI config
├── migrations/
│   ├── 20261025000001_create_anggota.sql
│   └── 20261025000002_rls_and_storage.sql
└── functions/
    └── cek-keanggotaan/
        └── index.ts                  # Edge Function (Deno)

scripts/
├── seed-anggota.mjs                  # CSV → Supabase (upsert by nim)
└── upload-foto-anggota.mjs           # lokal/URL → Storage

src/
├── components/
│   ├── MemberCard.astro              # kartu keanggotaan (visual)
│   ├── MemberLookupForm.astro        # form + state UI
│   ├── MemberVerifyCard.astro        # tampilan ringkas untuk /members/verify
│   └── ui/ (existing)                # Pill, IconBadge, CTA, SectionHeader
├── data/
│   └── anggota-demo.ts               # data contoh (dummy, fiktif)
├── pages/
│   ├── members.astro                 # ← fitur baru (replaces halaman lama)
│   ├── members/
│   │   └── verify.astro              # verifikasi via ID kartu (QR)
│   └── pengurus.astro                # ← halaman lama (5 pengurus) dipindah
└── utils/
    └── supabase.ts                   # URL/key accessor (PUBLIC_* only)

.github/workflows/deploy.yml          # + env dari secrets
```

**Konvensi penting (dari `DESIGN-SPEC.md` & audit kode):**
- `Record<string, string>` **wajib** didefinisikan di frontmatter, **dilarang** di template expression (Astro parse error).
- Tailwind class **wajib statis** — `text-${accent}` tidak dikompilasi. Pakai map (`ACCENT_BG` / `ACCENT_TEXT` di `src/data/categories.ts`).
- Link internal wajib lewat `link()` helper (`src/utils/link.ts`) agar base-path aware.
- Ikon: Boxicons via CDN (`bx bx-*`), **wajib** dicek ke `boxicons@2.1.4` (pernah ada bug `bx-hammer` yang tidak ada).

---

## 10. Fase Implementasi (Estimasi)

| Fase | Isi | Estimasi |
|---|---|---|
| **F0** | Setup Supabase project, migration SQL (tabel + RLS + bucket), seed script skeleton, `.env.example` | 0.5–1 hari |
| **F1** | Edge Function `cek-keanggotaan` + rate limit + tests manual via curl | 1–1.5 hari |
| **F2** | Komponen `MemberCard.astro` + `MemberLookupForm.astro` + state UI (idle/loading/success/error) | 1.5–2 hari |
| **F3** | Halaman `/members` (hero + preview dummy + form + benefit cards + CTA) + nav jadi | 1 hari |
| **F4** | `/members/verify` (QR target) + print stylesheet | 0.5–1 hari |
| **F5** | Seed script lengkap (CSV → DB, validasi, upsert, laporan) + upload foto | 1 hari |
| **F6** | Docs (README, PROJECT_STRUCTURE, SUPABASE_SETUP.md) + QA (a11y, responsive, security scan) | 0.5–1 hari |
| **F7** | (opsional, fase 2) Export PNG kartu, bulk invite WhatsApp, batch verification | — |

**Total: ~6–8 hari kerja** (belum termasuk proses pengumpulan data roster).

---

## 11. Risiko & Mitigasi

| # | Risiko | Dampak | Mitigasi |
|---|---|---|---|
| R1 | **NIM bocor** via repo/log/response | Tinggi (privasi) | RLS ketat, no NIM in response, hash in logs, no NIM in repo, OQ-1 답 dataFLow |
| R2 | **Endpoint di-enumerate** | Tinggi (data leak massal) | Rate limit per IP, no list endpoint, uniform 404, monitoring |
| R3 | **Data roster tidak terkumpul / privacy consent** | Tinggi (blokir GA) | Proses opt-in, `consent` field, tidak publikasi tanpa persetujuan" |
| R4 | **Supabase free tier habis** (bandwidth / functions) | Sedang | kuota free 500MB egress + 2M edge invocations → cukup untuk 
  
 thousands orang; monitor |
| R5 | **Env GitHub Actions belum diset** di fork/CI | Sedang | Halaman fallback graceful (F6) + `.env.example` + checklist setup |
| R6 | **Konflik rute `/members`** | Sedang | single: halaman lama → `/pengurus`, nav item di-update, link lama tetap jalan (redirect tidak wajib karena URL baru) |
| R7 | **Foto membengkalkan repo** | Rendah | Foto di Supabase Storage, bukan repo |
| R8 | **QR generator dependency** | Rendah | Pilih lib kecil (`qrcode` ~20KB) atau generate di Edge Function |
| R9 | **NIM format tak seragam** antar angkatan | Sedang | Regex longgar 10–11 digit + normalisasi + opsi fallback multi-key (nama+NIM) |
| R10 | **Kartu dipakai untuk Hal yang tidakfair** | Rendah | Terms: kartu adalah bukti keanggotaan, bukan identitas resmi |

---

## 12. Open Questions

| ID | Pertanyaan | Rekomendasi | Impact |
|---|---|---|---|
| **OQ-1** | **Dari mana roster anggota (NIM, nama, angkatan, jurusan, foto) comes?** CSV/Sheet/Form? Berapa banyak orang? | Sheet/CSV terpusat, diisi admin, lalu di-import via `seed:anggota` | **Blocking** — menentukan timeline |
| **OQ-2** | Apakah **alumni** juga masuk database (bisa dicek NIM-nya)? | Tidak dulu — fokus anggota aktif + bootcamp. Alumni tetap di halaman statis `/alumni` | Sedang |
| **OQ-3** | Untuk NIM terdaftar tapi `status = 'nonaktif'`, balas apa? | `found:false` dengan pesan generik (anti-enumeration). Kalau mau informatif: "Keanggotaan sudah tidak aktif." | Sedang — impacts UX & privacy |
| **OQ-4** | Perlu fitur **unduh kartu PNG**? | Tidak wajib fase 1 — print CSS + screenshot cukup. Tunda | Rendah |
| **OQ-5** | Tampilkan NIM di kartu (masked sebagian)? | Tampilkan **masked** (`22•••••345`) sebagai bukti, ID kartu sebagai token utama | Rendah |
| **OQ-6** | Consent foto: Separate flag `foto_consent`? | Pakai `foto_path` non-null = consent (simple). Kalau butuh eksplisit, tambah kolom `consent_foto` | Sedang |
| **OQ-7** | Nama halaman & label navbar? "Kartu Keanggotaan" vs "Kartu Saya" vs "Anggota" | "Kartu Keanggotaan" (jelas, searchable) | Rendah |
| **OQ-8** | Batch/lapis warna kartu: per angkatan atau per status? | Per status (aktif=mint, alumni=sky) + aksen gradient per angkatan | Rendah |
| **OQ-9** | Perlu **verifikasi admin** (dual check) sebelum anggota aktif? | Tidak fase 1 | Rendah |
| **OQ-10** | Where source of truth for `nama`/`jurusan`: Supabase only, atau tetap sinkron dengan alumni JSON? | Supabase = source of truth untuk anggota. Alumni JSON tetap terpisah (untuk halaman statis `/alumni`) | Sedang |

---

## 13. Checklist Kepatuhan

| Item | Status |
|---|---|
| Struktur konten halaman existing tidak diubah | ✅ Halaman baru, halaman lama dipindah (dicek) |
| Copy Bahasa Indonesia | ✅ §7.4 |
| Dark mode tidak diimplementasikan | ✅ Out of scope |
| Token warna & tipografi dari `DESIGN-SPEC.md` | ✅ §7.2 |
| URL existing tidak rusak | ✅ `/pengurus` baru, `/members` tetap hidup |
| Tidak ada secret di client / repo | ✅ S2, N2, N3 |
| Privasi data anggota dihormati | ✅ §6.6 |
| Tidak menambah framework JS berat | ✅ vanilla JS |

---

## 14. Lampiran

### A. Struktur response API (canonical)

```ts
type LookupResponse =
  | { found: true; member: MemberPayload }
  | { found: false; message: string }
  | { found: false; error: 'invalid_input' | 'rate_limited' | 'server_error' };

interface MemberPayload {
  nama: string;
  angkatan: number;
  jurusan: string;
  status: 'aktif' | 'alumni' | 'nonaktif';
  program: string | null;
  fotoUrl: string | null;   // signed URL, TTL 5 menit
  fotoTipe: 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | null;
  cardId: string;          // KMD-2024-0123
}
```

### B. Regex validasi NIM

```ts
// 10–11 digit, setelah normalisasi (hapus spasi/tanda hubung, uppercase)
const NIM_PATTERN = /^\d{10,11}$/;
```

### C. Format ID kartu

```
KMD-<angkatan 4 digit>-<nomor urut 4 digit, zero-padded>
Contoh: KMD-2024-0123
```
Nomor urut = sequence per angkatan (dihasilkan saat seed, stored in DB).

### D. Contoh payload Edge Function (Deno)

```ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const NIM_PATTERN = /^\d{10,11}$/;

Deno.serve(async (req) => {
  // 1. CORS
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // 2. Parse & validate
  const body = await req.json().catch(() => null);
  const nim = String(body?.nim ?? '').replace(/[\s-]/g, '');
  if (!NIM_PATTERN.test(nim)) {
    return json({ found: false, error: 'invalid_input' }, 400);
  }

  // 3. Rate limit (5–10 request / menit per IP hash)
  // 4. Query dengan service_role
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from('anggota')
    .select('nama, angkatan, jurusan, status, program, foto_path, foto_tipe, card_id')
    .eq('nim', nim)
    .eq('status', 'aktif')            // atau filter status di app
    .maybeSingle();

  if (!data) return json({ found: false, message: 'NIM tidak terdaftar.' }, 404);

  // 5. Signed URL foto (TTL 5 menit)
  const fotoUrl = data.foto_path
    ? await supabase.storage.from('foto-anggota').createSignedUrl(data.foto_path, 300)
    : null;

  return json({ found: true, member: { ...data, fotoUrl } });
});
```

### E. Checklist setup Supabase (untuk dokumentasi)

1. Buat project di [supabase.com](https://supabase.com) (free tier).
2. Salin `Project URL` + `anon public key` → `.env` lokal + GitHub Actions secrets.
3. Jalankan migration SQL (lewat SQL Editor atau `supabase db push`).
4. Buat bucket `foto-anggota` (private) + policy storage untuk service_role.
5. Deploy Edge Function: `supabase functions deploy cek-keanggotaan --no-verify-jwt` (atau dengan JWT verify).
6. Isi `SUPABASE_SERVICE_ROLE_KEY` di Supabase dashboard → Edge Function secrets (`supabase secrets set`).
7. Jalankan `npm run seed:anggota -- roster.csv`.
8. Uji: `curl -X POST "$SUPABASE_URL/functions/v1/cek-keanggotaan" -H "apikey: $ANON_KEY" -d '{"nim":"2210512345"}'`.
