# PRD — Redesign Tampilan Web Komandro CCIT-FTUI

| Field | Detail |
|---|---|
| **Dokumen** | Product Requirements Document — Redesign Web Komandro |
| **Versi** | 1.0 (Draft untuk review) |
| **Tanggal** | 2026-10-24 |
| **Owner** | Tim Komandro CCIT-FTUI (web) |
| **Status** | Draft — menunggu approval scope & pilihan konsep |
| **Produk** | Website Komandro CCIT-FTUI (`komandro-ccit.github.io`) |
| **Stack** | Astro 4 (static) + Tailwind CSS 3 + MDX + Mermaid, deploy GitHub Pages |

---

## 1. Ringkasan Eksekutif

Komandro CCIT-FTUI adalah komunitas Android & Teknologi di FTUI yang berdiri sejak 2015, dengan **133 file materi** (lesson/kurikulum/artikel) + blog + direktori alumni 11 batch. Situs sudah underwent satu round redesign besar (commit `2b753a8`, Material-3-flavoured, tone "corporate/institutional") dan **sudah diimplementasikan penuh** — artinya redesign berikutnya adalah **evolusi**, bukan mulai dari nol.

PRD ini mendefinisikan **redesign tampilan (visual + UX)** untuk meningkatkan:

1. **Discoverability materi** — 133 materi tersebar, "pathway" belajar sulitisoryamid user baru sering tersesat.
2. **Kecepatan & rasa modern** — nuansa "corporate brochure" sekarang kurang berasa komunitas teknik muda.
3. **Mobile-first** — majority pengguna potensial mobile (komunitas Android/Linux), reading materi harus impeccable di layar kecil.
4. **Konsistensi sistem desain** — ada 2 sistem desain bercampur (Material 3 tokens + legacy `#4CAF50` + Tailwind default `slate`/`gray`), dan `showcase.astro` masih memakai data dummy (`figma.com/example-...`) yang harus dibersihkan.

### 1.1 Out of Scope

- Migrasi stack (tetap Astro + Tailwind; tidak pindah ke Next.js/React).
- Backend/CMS/penulisan kolaboratif (tetap file MDX di repo).
- Fitur login / member area / progress tracking server-side.
- Animation-heavy design (GSAP/Framer Motion) dan 3D/WebGL.
- Perubahan struktur konten & URL (URL existing harus 100% backward-compatible → link lama tidak putus).

---

## 2. Latar Belakang & Diagnosis

### 2.1 Audit kondisi saat ini

| Aspek | Temuan |
|---|---|
| **Visual** | Arah desain sekarang: *flat corporate / institutional* — hero ber-pattern grid, tipografi Inter + label uppercase, aksen hijau legacy `#4CAF50` bercampur token M3 (`primary-m3: #006d3b`, `primary-container: #3ddc84`). Terasa "korporat" & generik. |
| **Sistem desain** | Token ganda: `primary` (legacy) vs `primary-m3`; `surface-light` / `surface-container-*` (M3) bercampur dengan `slate-dark`, `gray-50`, `bg-slate-50` hardcode. `border-surface-border` dipakai di Navbar tapi token `surface-border` **tidak ada** di `tailwind.config.cjs` → border itu **tidak ter-render** (bug visual laten). |
| **Struktur halaman** | 14 route: `/`, `/about`, `/members`, `/program-kerja`, `/alumni`, `/alumni/[year]`, `/material`, `/material/[category]`, `/material/[category]/[curriculum]`, `/material/[category]/[curriculum]/[lesson]`, `/material/[category]/[slug]`, `/blog`, `/blog/[...slug]`, `/showcase`. |
| **Konten** | 133 `.mdx` + 3 blog. `material/index.astro` mendefinisikan 8 kategori (web, mobile, ui-ux, qa, devops, iot, game, tools), sementara `content/config.ts` mengizinkan 13 enum — `backend`, `frontend`, `cyber-security`, `ai-ml`, `database`, `cloud` **tidak punya halaman kategori** (konten yatim). |
| **Duplikasi** | `flutter-advance`, `flutter-beginner`, `dart-fundamentals` punya lesson `-jawaban` / `-latihan` sebagai file terpisah; `ui-ux` masih menyimpan file versi lama (`lesson-1-darkmode-principles.mdx`). |
| **Data dummy** | `showcase.astro` 100% hardcoded placeholder (`figma.com/example-ecommerce`, nama fiktif, gambar `/images/showcase/*.jpg` yang **belum ada** di `public/`). Merusak kredibilitas. |
| **Copy** | Campur bahasa: hero & footer 100% Inggris ("Cultivating the Next Generation of Technology Leaders", "Hall of Fame", "Academic Resources", "Publications"), konten & data member 100% Bahasa Indonesia. |
| **Aksesibilitas** | Dropdown Navbar relying on `:hover` + `opacity/visibility` tanpa `aria-expanded`/keyboard support; heading hierarchy tidak konsisten antar halaman; `text-white/50` di footer borderline kontras. |
| **Performa** | Google Fonts render-blocking (Inter + JetBrains Mono), BoxIcons via unpkg CSS (blocking, icon font ~hundreds KB), mermaid di-load runtime, tidak ada preload font. |
| **SEO** | Ada `<meta description>`, tapi **tidak ada** Open Graph/Twitter Card, **tidak ada** `sitemap.xml`, **tidak ada** JSON-LD `Organization`, **tidak ada** canonical URL. |
| **Gambar** | `ImageLightbox.astro` sudah ada (bagus), tapi belum ada `loading="lazy"`/`decoding="async"` terstruktur di kartu, dan tidak ada responsive `srcset`. |

### 2.2 Pain point utama

1. **"Materi banyak, tapi pathway-nya nggak jelas."** Anggota/user baru tidak tahu mulai dari mana → banyak materi tak pernah dibuka.
2. **Tampilan terasa kaku & korporat**, tidak mencerminkan energi komunitas teknik muda (anggota baru 18–22 tahun).
3. **Homepage adalah "dinding"** — hero 80vh + stats + pillars + direktori: first scroll sangat panjang, nilai utama belum tersampaikan.
4. **Halaman materi (reading) justru aset terbaik** — `ReadingLayout` + TOC + stepper + prerequisites sudah bagus → **jangan dirombak total**.
5. **Navigasi 3-level + submenu hover** → sulit dipakai di touch device, tidak ada affordance yang jelas.
6. **Konten dummy & kategori kosong** → kredibilitas turun drastis.

### 2.3 Competitive benchmark (positioning, bukan copy-paste)

| Referensi | Yang kami ambil |
|---|---|
| **freeCodeCamp** | Learning path yang jelas + CTA ke materi |
| **roadmap.sh** | Visual stepper untuk urutan belajar |
| **Vue / Vite / Astro docs** | Sidebar hierarkis, "on this page", reading teknis |
| **Linear / Vercel / Stripe Press** | Tipografi, ritme layout, rasa premium |
| **Material Design 3 docs** | Token system, adaptive layout, dark mode |
| **Komunitas dev Indonesia** | Bahasa Indonesia natural, tone kekinian, galeri karya |

---

## 3. Tujuan & Sasaran

### 3.1 Goals & KPI

| # | Goal | KPI |
|---|---|---|
| G1 | **Pathway belajar jelas** — user baru tahu "mulai dari mana" < 60 detik | ≥60% klik pertama ke materi lewat CTA homepage (`path_cta_click` event) |
| G2 | **Reading materi mobile** terasa mulus | Lighthouse Mobile **Performance ≥ 90**, **LCP ≤ 2.5s**, **CLS ≤ 0.1** |
| G3 | **Konsistensi visual total** | 0 hardcoded hex di `src/`; semua warna via token; token legacy dihapus |
| G4 | **Kredibilitas** — tidak ada data dummy terlihat | 0 placeholder `example.` di production build; Showcase 100% data alumni real |
| G5 | **Satu bahasa, satu suara** | 100% copy UI Bahasa Indonesia (istilah teknis boleh English) |
| G6 | **Discoverability & SEO** | Sitemap + OG tags + JSON-LD aktif; tiap halaman punya OG image |
| G7 | **Shareability** | Tombol "Salin link" + OG image per materi/proyek |

### 3.2 Non-Goals

- Menambah fitur produk baru (kalender event, LMS progress server, membership system).
- Mengganti Astro.
- Menulis ulang isi 133 materi (hanya perbaikan typo/heading seperlunya).
- Animation-heavy design, 3D/WebGL, video background.

---

## 4. Target Pengguna & Use Case

### 4.1 Persona

| Persona | Kebutuhan | Halaman kunci |
|---|---|---|
| **P1 — Calon Anggota Baru** (18–22, mahasiswa FTUI, baru lihat IG) | "Apa itu Komandro? Mulai dari mana? Beginner-friendly?" | `/`, `/material`, `/program-kerja` |
| **P2 — Anggota Aktif** (cari referensi cepat, lanjutkan belajar) | "Cari materi Flutter/Dart cepat, baca, tracking urutan" | `/material`, `/material/[category]`, lesson, `/blog` |
| **P3 — Alumni** (lama, mau lihat karya & tetap terhubung) | "Lihat rekam jejak, karya alumni" | `/alumni`, `/showcase` |
| **P4 — Pengajar & Mitra** (dosen, industri) | "Lihat kapasitas & kurikulum, ajak kerja sama" | `/about`, `/program-kerja`, `/members` |

### 4.2 User journey utama

```
Calon anggota baru (mobile)
  → IG / link → /
  → hero (value prop 1 kalimat) → CTA "Mulai Belajar" + "Gabung Komandro"
  → /material → pilih jalur (populer / sesuai tujuan) → daftar kurikulum
  → lesson preview (judul + durasi + prasyarat) → baca materi
  → CTA "Lanjut ke materi berikutnya" → kembali ke /alumni atau /showcase
```

### 4.3 Arsitektur informasi

| Level | Halaman | Peran |
|---|---|---|
| Landing | `/` | Pintu masuk + CTA |
| Browse | `/material`, `/material/[category]` | Jelajah & filter |
| Learn | curriculum index, lesson | Pembelajaran inti (aset utama) |
| Community | `/alumni`, `/showcase`, `/members`, `/blog` | Bukti sosial & kultur |
| About | `/about`, `/program-kerja` | Kredibilitas organisasi |

---

## 5. Tiga Rekomendasi Konsep Tampilan

> Ketiganya memakai **satu fondasi teknis yang sama** (§7) supaya migrasi & maintenance mudah. Yang berbeda: **karakter visual, struktur homepage, dan pola interaksi utama**.

---

### 5.1 Rekomendasi A — **"Neo-Brutalist Dev"** (Editorial Klasik / Retro-Terminal)

**Karakter:** tegas, monospaced accents, kontras tinggi, nuansa "kode editor & terminal".

**Filosofi:** *"Komandro = engineering collective. Tampilan harus terasa seperti tools yang dipakai engineer, bukan brosur korporat."* Hero bergaya terminal window (`$ komandro --help`), tipografi monospace untuk aksen, border tebal, offset shadow tanpa blur, palet high-contrast dengan satu aksen hijau.

**Visual language**

- **Palet**: dark `#0d1117` / fg `#e6edf3` + aksen `#3ddc84` (Android green) & `#f0a202` (amber). Light: `#ffffff` / `#191c1e` + aksen sama.
- **Tipografi**: heading `JetBrains Mono` (bold) → ini yang memberi "dev vibes"; body `Inter`; label `uppercase tracking-widest` mono.
- **Shape**: radius 0–2px, `border: 2px solid`, `box-shadow: 4px 4px 0` (hard shadow, no blur).
- **Texture**: subtle grid pattern di background (sudah ada `.hero-pattern`), `::selection` aksen hijau.
- **Motion**: cepat (120–160ms); hover = geser 2px + shadow berubah (bukan scale).

**Struktur homepage**

1. **Hero terminal** — blok `>` prompt: `> whoami` → "Komandro CCIT-FTUI — Komunitas Android & Teknologi sejak 2015", 2 CTA.
2. **Stats bar** — 500+ alumni, 11 batch, 133 materi, 50+ workshop, dalam 1 baris dengan border 2px.
3. **Pathway picker** (bagian utama) — 3–4 kartu "jalur belajar" (Web / Mobile / UI/UX / DevOps) dengan diagram step mini.
4. **Latest materials** — terminal list `ls -la materials/` dengan metadata (tanggal, kategori, durasi).
5. **Timeline sejarah 2014–2026** — gaya diff/patch (hijau = tambah, amber = ubah).
6. **CTA gabung** — "join the collective" + link rekrutmen.

**Halaman materi**

- `ReadingLayout` dipertahankan (aset terbaik), chrome diubah:
  - Navbar: garis 2px, mono label, dropdown hover → **panel full-width on click** (lebih touch-friendly).
  - Lesson: breadcrumb mono `~/materials/mobile/flutter/02-http`, TOC dengan penanda `▸`, prev/next sebagai "cmd bar" di bawah.
  - Code block: pertahankan `github-dark`, tambah prompt `$` untuk blok bash.
  - **Tab switch** "Materi | Jawaban | Latihan" untuk lesson `-jawaban`/`-latihan` (mengurangi file terpisah).

**Kelebihan**

- Sangat distinctive, mudah diingat, sangat pas untuk brand komunitas teknik.
- Cocok dengan konten terminal/CLI-heavy (materi Git, Docker, DevOps).
- Murah diimplementasikan — utility classes, tanpa library baru.

**Kekurangan / risiko**

- Terasa "dev tool" bagi prospect industri (P4) → perlu copy lebih soft di halaman About.
- Aksen hijau neon harus dijaga kontrasnya (rawan accessiblity issue).
- Mono untuk heading bisa mengurangi keterbacaan di mobile kecil → wajib responsive heading scale.

---

### 5.2 Rekomendasi B — **"Modern Editorial / Swiss Grid"** (Premium, Terang)

**Karakter:** bersih, tipografi besar, banyak whitespace, layout majalah, rasa premium-akademik.

**Filosofi:** *"Kelompok teknik terbaik punya situs seperti majalah (Linear, Vercel, Stripe Press). Tampilan harus memancarkan authority & kedalaman, bukan noise."*

**Visual language**

- **Palet**: netral hangat `#fbfbf9` (kertas) / teks `#121212` / aksen `#006d3b` (hijau M3 existing) + sekunder `#ff6b35` untuk CTA sekunder. Tanpa gradient besar.
- **Tipografi**: heading serif editorial (`Fraunces` / `Instrument Serif` / `Newsreader`) untuk karakter; body `Inter`; label mono kecil. Alternatif full-sans (`Inter Tight`) dengan ukuran XL.
- **Shape**: radius besar (12–20px) atau tanpa border sama sekali, dipisah dengan whitespace & hairline `border-neutral-200`.
- **Layout**: Swiss grid 12 kolom tegas, asymmetry terkontrol, section dengan headline besar + daftar ramping.
- **Motion**: halus, `cubic-bezier(0.16, 1, 0.3, 1)`, 400ms, scroll-reveal minimal.

**Struktur homepage**

1. **Hero editorial** — headline serif besar 2 baris ("Belajar, Berkarya, Berkembang."), sub-teks, 2 CTA; di sisi kanan kartu stats/meta (establish authority lewat angka).
2. **Manifesto strip** — 1 kalimat manifesto besar, full-bleed.
3. **Tiga pilar** dengan nomor besar `01 / 02 / 03` — tipografis, bukan kartu.
4. **Pathway spotlight** — 3 jalur unggulan dengan mini-path visual (titik tersambung).
5. **Karya alumni (showcase real)** — gallery 3–4 item + caption.
6. **Journal preview** — 3 artikel terbaru sebagai list editorial (bukan card grid).
7. **Footer besar** — manifesto + CTA gabung.

**Halaman materi**

- Reading dengan **max-width 68ch**, tipografi premium, drop-cap optional, pull-quote untuk blok penting.
- **TOC sticky di kanan** (desktop) gaya "on this page" dengan indentasi.
- **Prev/Next** sebagai kartu besar di bawah artikel.
- Kartu materi: tanpa border, `bg-neutral-50` + hover lift; tag difficulty sebagai chip berwarna.

**Kelebihan**

- Paling "aman" & profesional — cocok untuk P4 (industri/dosen) dan P3 (alumni senior).
- Grid & tipografi mudah dipelihara, sedikit custom CSS.
- Persepsi kualitas kurikulum naik jelas.

**Kekurangan / risiko**

- Kurang berbeda dari situs modern pada umumnya → risiko "generic AI look".
- Tidak ada "wow" teknis; untuk P1 yang datang dari Instagram mungkin kurang menarik.
- Butuh +1 font (serif) → +1 request, minor.

---

### 5.3 Rekomendasi C — **"Android-First Product"** (M3 Expressive / Docs-like, Gelap & Cerah)

**Karakter:** produk seperti Google/Material — M3 tokens, dynamic color, shape besar, documentation-grade reading, plus **dark mode yang first-class**.

**Filosofi:** *"Kami komunitas Android → website harus terasa seperti produk Android: Material 3, dynamic color, dark theme yang benar-benar dikerjakan, reading experience seperti Google Docs."*

**Visual language**

- **Palet**: M3 dynamic color berbasis seed hijau `#006d3b` (sudah ada di config). Token primary/primary-container/secondary/tertiary + surface container elevations. Menambahkan **dark mode** penuh (surface `#101512`, on-surface `#e2e8e0`, dll).
- **Tipografi**: `Roboto` (M3 default) atau `Inter` + `Roboto Mono` untuk code; headline Roboto Display.
- **Shape**: M3 shape scale (extra-large 28px untuk card, full pill untuk chip/FAB).
- **Motion**: M3 emphasized easing `cubic-bezier(0.2, 0, 0, 1)`, 500ms, shared-axis transitions.
- **Nilai utama**: **dark mode** (toggle + `prefers-color-scheme`), **adaptive navigation** (rail di desktop, bottom navigation bar di mobile).
- **Layout**: desktop → **navigation rail** di kiri; mobile → **bottom navigation bar**; konten max-width 1200px.

**Struktur homepage**

1. **Hero M3 Expressive** — headline besar, sub-teks, filled + tonal button, plus **search bar "Mau belajar apa?"** (filter materi real-time) → paling bernilai untuk G1.
2. **Browse chips** — "Explore" / "Sedang populer".
3. **Path cards** — large container cards, icon M3, tonal elevation, trailing icon.
4. **Materi terbaru & populer** — FilledCard / ElevatedCard, thumbnail optional.
5. **Impact stats** — 4 stat card bertingkat elevation.
6. **Komunitas** — mini-grid anggota aktif + CTA gabung.
7. **Footer M3** — nav bar final, links, socials, dark-mode toggle.

**Halaman materi**

- **Docs-like layout**: sidebar kurikulum sticky (collapsible, scroll-spy), konten central, **right TOC** sticky (desktop).
- **Top app bar** sticky: breadcrumb + tombol share + tombol tema.
- **Search di dalam kurikulum** (client-side dari build-time index).
- **Progress marker**: "Lesson 3 / 12" + progress bar di app bar.
- **Code block**: dark card dengan filename header + tombol copy (shiki).
- **Tab switch** "Materi | Jawaban | Latihan" (konsisten dengan A).

**Kelebihan**

- **Paling sesuai brand** (komunitas Android) + dark mode = pembeda besar.
- Struktur docs-grade menyelesaikan G1 & G2 paling baik.
- Token M3 **sudah ada** → biaya implementasi paling rendah di antara 3 opsi.

**Kekurangan / risiko**

- M3 hari ini sangat umum → bisa terlihat "default Android".
- Dark mode = 2× token & QA (semua halaman + materi).
- Adaptive navigation = restrukturisasi navbar & semua halaman.
- Butuh disiplin agar tidak terasa "template Material".

---

### 5.3b Rekomendasi Tambahan — **"Casual & Colorful"** *(brief revisi: untuk mahasiswa, bukan korporat)*

Brief revisi dari stakeholder: *"Ini UKM IT, tapi justru jangan terlalu berbau IT. Mau lebih colorful untuk mahasiswa."*

Implikasi ke keputusan desain:
- **Ganti** framing "institution of engineering excellence" → framing **komunitas mahasiswa yang belajar bareng**.
- **Ganti** bahasa label English (Hall of Fame, Academic Resources) → **santai Bahasa Indonesia** ("Belajar", "Agenda", "Anggota").
- **Warna**: dari 1 aksen hijau monokrom → **multi-color playful**.
- **Tone**: dari "kompetensi/otoritas" → "ramah,accessible, energik".
- **Shape**: dari radius kecil/tegas → **radius besar + blob/tilted card**.
- **Copy**: pakai bahasa sehari-hari ("Bikin Aplikasi", "Gabung Yuk ✨", "Materi baru week ini").
- **Tambah section yang relevan untuk UKM**: Agenda/Event, Anggota Aktif, Testimoni alumni, Stats colorful.
- **Tetap**: mobile-first, reading materi tetap bersih & fokus (materi = konten berat, jangan dibuat norak).

---

#### **Konsep D — "Campus Pop"** ⭐ Rekomendasi

**Karakter:** bold, playful, warna-warni — seperti poster event mahasiswa.

**Visual language**
- **Palet**: ungu `#6C4DF6` · pink `#FF5C9A` · mint `#12C9A0` · amber `#FFB020` di atas kertas `#FFF9F3`, teks `#2A2340`.
- **Tipografi**: display `Fredoka` (rounded, playful) untuk heading + `Plus Jakarta Sans` untuk body.
- **Shape**: radius besar (22–32px), kartu miring ±5°, blob gradient blur sebagai dekorasi.
- **Motion**: hover lift + slight rotate (cubic-bezier bounce), marquee berjalan untuk daftar teknologi.
- **Texture**: blob gradient, bentuk ikon bulat (blob/circle) di kartu.

**Struktur homepage**
1. **Hero**: pill "Komunitas Android & Teknologi · FTUI · sejak 2015" + headline "Belajar coding bareng **teman-teman** yang seru" (dengan highlight marker kuning) + 2 CTA + avatar stack "500+ alumni sudah gabung".
2. **Marquee** teknologi: Flutter · Dart · Git & GitHub · Docker · UI/UX · Figma · ... (running scroll).
3. **"Mau ngapain dulu?"** — 4 kartu jalur warna-warni (Mobile/Web/DevOps/Desain), masing-masing warna berbeda.
4. **"Materi baru week ini"** — 3 kartu materi + level chip berwarna.
5. **"Agenda terdekat"** — 3 kartu event dengan tanggal, deskripsi, dan tag kategori.
6. **"Yang aktif di kampus"** — grid anggota + peran.
7. **Stats** — 4 kartu warna berbeda (ungu/pink/mint/amber).
8. **Join CTA** — gradient ungu→pink→amber.

**Kelebihan**
- Paling "mahasiswa", paling energik, paling berbeda dari desain korporat sekarang.
- 4 warna aksen memberi affordance kuat untuk kategori & level.
- Section Agenda/Anggota benar-benar relevan untuk UKM (bukan filler).

**Kekurangan / risiko**
- Terlalu banyak warna bisa bikin "toy" — harus dijaga: warna hanya untuk kartu/ikon, teks & layout tetap netral.
- Butuh raster/gradient blob → sedikit lebih berat, hindari blur besar di mobile.

---

#### **Konsep E — "Sticker Club"**

**Karakter:** estetika stiker & doodle — papan bulletin UKM.

**Visual language**
- **Palet**: grape `#7B4BFF` · coral `#FF6B6B` · sun `#FFC93C` · mint `#3DD9B0` · bubble `#FFE3F1` di atas `#FFFDF7`.
- **Tipografi**: `Baloo 2` (rounded playful) untuk heading + `Nunito` untuk body.
- **Shape**: **border 3px solid** + **hard shadow 5px** (neumorphic flat), card "sticker" miring ±6°, badge/label rounded.
- **Motion**: hover translate -3px + shadow membesar (efek "tombol ditekan").
- **Detail**: underline SVG Gratis di headline, sticker badge ("Populer", "Baru"), checklist di kartu jalur.

**Struktur homepage**
1. **Hero** terpusat: badge miring "⚡ Android & Technology Community", headline dengan garis highlight SVG, 2 CTA thick-border, avatar stack.
2. **4 stat tile** dengan border+shadow (Materi / Senior Membantu / Event / Job Ready).
3. **"Pilih Jurusanmu"** — 4 kartu 2-kolom, tiap kartu punya icon dalam kotak berwarna + badge miring.
4. **"Materi freshly dropped"** — 3 kartu dengan progress bar.
5. **Jadwal** dalam panel bubble pink dengan border + shadow.
6. **Quote testimoni** di panel ungu solid.
7. **Join** panel kuning dengan 2 CTA.

**Kelebihan**
- Paling *distinctive* & paling "gampus". Pinterest-viral.
- Sticker/badge bisa dipakai konsisten untuk status (Populer/Baru/level) — sistem yang mudah dikembangkan.
- Hard shadow + border = feel 2D yang ikonik & cheap to implement.

**Kekurangan / risiko**
- Terlalu "kawaii" bisa kurang serius untuk halaman About/Program Kerja → perlu versi lebih kalem di situ.
- Border 3px + shadow bisa berat di layar kecil → kurangi shadow di mobile.

---

#### **Konsep F — "Soft & Friendly"**

**Karakter:** pastel lembut, modern, rapi — casual tapi tetap credibility.

**Visual language**
- **Palet**: lavender `#7C5CFC` · pink `#FF8FB1` · mint `#5CC9A9` · amber `#F5B445` di atas `#F6F4FB` (abu ungu muda), card putih.
- **Tipografi**: `Outfit` (display) + `Manrope` (body).
- **Shape**: radius 20–24px, tanpa border tebal, glow blur sangat lembut (filter blur 90px diBehind cards).
- **Motion**: hover lift halus (-5px) + shadow lembut; progress bar animatif di kartu materi.
- **Detail**: icon dalam rounded square berwarna (bukan emoji mentah), pill untuk level.

**Struktur homepage**
1. **Hero**: glow blur di belakang, headline "Belajar bikin aplikasi bareng **teman-campus**", CTA, proof "500+ alumni dari 11 batch".
2. **Trust bar** 4 angka (borderless card putih).
3. **"Empat jalur belajar"** — 4 kartu dengan icon rounded, meta pill, CTA "Mulai →".
4. **"Materi yang baru rilis"** — 3 kartu + progress bar.
5. **"Agenda"** — 3 kartu event + info peserta/lokasi.
6. **"Yang aktif di kampus"** — 5 anggota.
7. **Testimoni** card putih dengan tanda kutip besar.
8. **Join** panel gradient lavender→pink.

**Kelebihan**
- **Paling aman & paling "{casual tapi profesional}"** — cocok kalau stakeholders mau "warna-warni" tapi tetap takut kehilangan wibawa.
- Paling mudah dikombinasikan dengan halaman materi yang sekarang (ReadingLayout relatif netral).
- Visual system-nya paling mudah diperluas (tambah halaman baru tinggal pakai card + pill).

**Kekurangan / risiko**
- Kurang "berteriak" — cocok untuk recruiting yang calm, tapi kurang impact untuk event besar.
- Perlu disiplin agar tidak jadi "template startup".

---

### 5.4 Perbandingan ketiga konsep

| Kriteria | A. Neo-Brutalist Dev | B. Modern Editorial | C. Android-First (M3) |
|---|---|---|---|
| Distinctiveness | ★★★★★ | ★★★☆☆ | ★★★☆☆ |
| Cocok brand "Android community" | ★★★☆☆ | ★★★☆☆ | ★★★★★ |
| Dampak pathway belajar (G1) | ★★★★☆ | ★★★☆☆ | ★★★★★ |
| UX reading mobile (G2) | ★★★★☆ | ★★★★☆ | ★★★★★ |
| Kredibilitas industri (P4) | ★★☆☆☆ | ★★★★★ | ★★★★☆ |
| Biaya implementasi | ★★★★★ (murah) | ★★★★☆ | ★★★☆☆ (dark mode 2× QA) |
| Effort dark mode | ★★☆☆☆ | ★★★☆☆ | ★★★★☆ |
| Winning content | Terminal/Git/DevOps | About, Alumni, Blog | Mobile reading, materi |

### 5.5 Rekomendasi saya

**Rekomendasi C (Android-First Product)** sebagai arah utama, **dengan sentuhan A** untuk aksen (mono label, terminal blocks di section tertentu).

Alasannya:
1. Brand mismatch paling kecil → **komunitas Android** dengan situs yang terasa seperti produk Android.
2. Token M3 sudah ada → biaya implementasi paling rendah, risiko paling kecil untuk tim kecil.
3. Dark mode + search bar menjawab 2 pain point terbesar (reading mobile & pathway).
4. Struktur docs-grade proven untuk konten 133 materi tanpa perlu ganti mental model pengguna.

Kalau tim lebih suka "wow" dan siap beda dari kompetitor: **A** adalah pilihan paling distinctive. **B** paling aman untuk audiens industri/dosen.

---

### 5.6 Rekomendasi setelah brief revisi (casual & colorful)

Dengan brief "**casual, colorful, untuk mahasiswa, jangan terlalu berbau IT**", rekomendasinya berubah:

| Prioritas | Konsep | Alasan |
|---|---|---|
| **1** | **D — Campus Pop** | Paling energik, paling "gampus", paling beda dari korporat. Multi-warna + section Agenda/Anggota relevan untuk UKM. |
| **2** | **F — Soft & Friendly** | Kalau mau casual tapi tetap aman & kredibel. Paling mudah dikombinasikan dengan halaman materi sekarang. |
| **3** | **E — Sticker Club** | Paling unik/visually distinct, tapi paling "kawaii" — perlu versi lebih kalem di halaman About & Program Kerja. |

**Aturan hybrid yang aku sarankan (dipakai di semua konsep D/E/F):**
1. **Homepage & halaman "community"** (agenda, anggota, alumni, showcase) → playful/colorful penuh.
2. **Halaman materi (reading)** → tetap bersih & fokus, tapi **pakai warna yang sama** (accent per kategori, chip level berwarna) supaya konsisten.
3. **Halaman About / Program Kerja** → versi "dilebihkan kalem" dari konsep yang dipilih.
4. **Semua teks tetap Bahasa Indonesia santai**, istilah teknis boleh English.
5. Warna hanya untuk **kartu, ikon, chip, dan aksen** — background & teks tetap netral supaya kontras & keterbacaan aman.

---

## 6. Requirements & Acceptable Criteria

### 6.1 Fungsional (FR)

| ID | Requirement | Prioritas |
|---|---|---|
| FR-01 | Navigasi utama adapts: desktop top-nav/rail, mobile drawer/bottom-bar, tanpa submenu hover-only | Must |
| FR-02 | Homepage menampilkan hero + CTA + pathway picker + materi terbaru + CTA gabung | Must |
| FR-03 | `/material` punya pencarian/filter client-side (judul, tag, kategori) | Must |
| FR-04 | Halaman lesson punya TOC sticky, prev/next, prerequisites, breadcrumbs | Must |
| FR-05 | Lesson `-jawaban`/`-latihan` bisa diakses sebagai tab di halaman lesson | Should |
| FR-06 | Dark mode (toggle + `prefers-color-scheme`) di seluruh halaman | Must (opsi C) / Nice (A,B) |
| FR-07 | Tombol salin link / share di halaman materi & proyek | Should |
| FR-08 | Halaman kategori konsisten dengan 8 kategori yang ada; kategori tanpa konten disembunyikan atau diberi state "segera" | Must |
| FR-09 | Showcase memakai data nyata (JSON di `src/data/showcase.json`) | Must |
| FR-10 | Semua halaman punya breadcrumb (kecuali homepage) | Should |
| FR-11 | Error/empty state designs (kategori kosong, belum ada alumni, blog kosong) | Should |
| FR-12 | Search bisa_bnavigate dengan keyboard (`/` shortcut di halaman browse) | Nice |

### 6.2 Non-fungsional (NFR)

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Lighthouse Performance (mobile) | ≥ 90 |
| NFR-02 | LCP / CLS / INP | ≤2.5s / ≤0.1 / ≤200ms |
| NFR-03 | Bundle JS halaman statis | ≤ 80KB gzip |
| NFR-04 | CLS saat load gambar | 0 (semua img punya width/height atau aspect-ratio) |
| NFR-05 | Kontras teks | ≥ 4.5:1 (WCAG AA) |
| NFR-06 | Keyboard navigation | Semua elemen interaktif dapat diakses via keyboard, focus ring visible |
| NFR-07 | Semantic HTML | 1× h1 per halaman, heading hierarkis, landmark (`nav`, `main`, `footer`) |
| NFR-08 | Breakpoints | Mobile-first, uji di 360 / 390 / 768 / 1024 / 1440 |
| NFR-09 | CLS-safe image | `loading="lazy"` + `decoding="async"` + dimensi eksplisit |
| NFR-10 | Build | `npm run build` sukses tanpa warning baru; deploy tetap GitHub Pages via `base` config |

### 6.3 Content requirements

| ID | Requirement |
|---|---|
| CR-01 | Seluruh copy UI ditulis Bahasa Indonesia; istilah teknis (Flutter, DevOps, PR) boleh English |
| CR-02 | Hapus semua data dummy & placeholder di production (`showcase`, `/images/showcase/*`) |
| CR-03 | Copy hero & CTA ditulis ulang (hapus jargon korporat Inggris: "Hall of Fame", "Academic Resources", "Cultivating...") |
| CR-04 | Tiap kategori punya deskripsi 1–2 kalimat dalam Bahasa Indonesia + icon konsisten |
| CR-05 |-judul materi konsisten (Tiap): kapitalisasi & pluralisasi seragam (udah dikerjakan di commit `b35642e`, pertahankan) |

---

## 7. Fondasi Teknis (Berlaku untuk Ketiga Konsep)

### 7.1 Token & theming

- Ganti `tailwind.config.cjs`: 1 set token final (hapus `primary` legacy & `surface-border` yang invalid), tambah token dark mode via `darkMode: 'class'` + CSS variables untuk dark/light.
- Semua warna硬code (`bg-slate-50`, `text-gray-*`, `bg-white`) diganti token semantik: `bg-surface`, `text-on-surface`, `text-on-surface-variant`, `border-outline-variant`.
- Font: pilih 1–2 family, self-host via `@fontsource` atau subset Google Fonts (self-host = tanpa render-blocking pihak ketiga).

### 7.2 Struktur komponen

```
src/
├── layouts/
│   ├── BaseLayout.astro      # html shell, meta, SEO, theme script
│   ├── PageLayout.astro      # + navbar + footer (semua halaman)
│   └── ReadingLayout.astro   # dipindah ke layouts/ (materi)
├── components/
│   ├── navigation/  (DesktopNav, MobileNav, NavigationRail, BottomNav)
│   ├── ui/          (Button, Card, Chip, Badge, Section, Container, Breadcrumb)
│   ├── material/    (MaterialCard, CurriculumCard, LessonList, TOC, Stepper, ProgressBar, SearchBox)
│   └── home/        (Hero, StatsBar, PathPicker, RecentMaterials, Timeline, CTASection)
├── data/            (about, members, programs, alumni, showcase, categories)
└── styles/          (tokens.css, prose.css, theme.css)
```

### 7.3 Meta, SEO, sharing

- `BaseLayout` menambah: `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `canonical`, `theme-color`.
- JSON-LD `Organization` di homepage, `LearningResource` / `Article` di halaman materi & blog.
- `sitemap.xml` + `robots.txt` via `@astrojs/sitemap`.
- OG image default (1200×630, branded) untuk halaman tanpa gambar khusus.

### 7.4 Performa

- Inline critical CSS untuk hero; preconnect hanya ke host yang dipakai; font `font-display: swap` + preload subset latin.
- Icon: pertahankan BoxIcons (sudah dipakai luas) tapi tambahkan `preconnect` + lazy-load CSS non-critical, atau ganti ke inline SVG set kecil.
- Mermaid: lazy-init saat elemen masuk viewport (IntersectionObserver).
- Gambar: `loading="lazy"`, `decoding="async"`, `aspect-ratio` reserved.

### 7.5 Aksesibilitas

- Navbar dropdown: `<button aria-expanded aria-controls>` + toggle on click + close on `Escape`/blur.
- Skip-to-content link.
- `prefers-reduced-motion` dihormati (disable transitions/animations).
- Focus-visible ring konsisten (`focus-visible:ring-2 ring-primary`).

### 7.6 Dark mode (opsional untuk A & B)

- `class` strategy; script inline di `<head>` membaca localStorage + `prefers-color-scheme` sebelum paint (anti-FOUC).
- Token dark: `surface #101512`, `surface-container #171d19`, `on-surface #e2e8e0`, `primary #43e188`, `outline #7d8f82`.
- Semua komponen wajib diuji di kedua mode (termasuk mermaid & code block).

---

## 8. Strategi Migrasi & Rollout

### 8.1 Fase

| Fase | Durasi | Deliverable |
|---|---|---|
| **F0 — Fondasi** | 3–4 hari | Token final, BaseLayout + SEO, komponen UI inti, dark-mode plumbing,分支 `feat/ui-redesign` |
| **F1 — Shell** | 2–3 hari | Navbar/rail/bottom-nav baru, footer baru, container & typography scale, 1 halaman referensi (`/`) |
| **F2 — Materi** | 4–5 hari | ReadingLayout dirapikan (TOC sticky, tabs jawaban/latihan, code block, search kurikulum) |
| **F3 — Konten & Community** | 3–4 hari | `/material`, `/material/[category]`, `/blog`, `/alumni`, `/showcase` (data nyata), `/about`, `/members`, `/program-kerja` |
| **F4 — Polish & QA** | 3–4 hari | Lighthouse, a11y audit, responsif 5 breakpoint, dark mode QA, copy review |
| **F5 — Release** | 1–2 hari | Preview di PR, review stakeholder, merge + deploy, monitor analytics |

Total estimasi: **16–22 hari kerja** (1 developer, ~4–5 minggu kalender).

### 8.2 Branching & rollback

```
master
 └── feat/ui-redesign            # trunk untuk semua perubahan redesign
      ├── feat/ui-redesign/foundation
      ├── feat/ui-redesign/shell
      ├── feat/ui-redesign/material
      └── feat/ui-redesign/content
```

- Semua PR ke `feat/ui-redesign`; merge ke `master` setelah F5.
- Rollback: `git revert` merge commit; tidak ada migrasi data (semua statis).

### 8.3 Risiko & mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Gaya bahasa campur (EN/ID) dipertahankan sebagian |copy tidak konsisten | Copy deck tunggal di F1; review di F4 (FR/CR-01) |
| 133 materi format tidak seragam → tampilan patchy |QoC rendah | Template lesson seragam;抽查 20 materi worst-case di F2 |
| Scope creep (fitur baru) | jadwal molor | Non-goals list dikunci di §1.1 & §3.2 |
| Dark mode menambah 2× QA | Quality issue | Audit visual checklist per halaman;截图 review tiap sprint |
| Konten dummy tak sempat diganti | kredibilitas | Showase data JSON minimal (3 item nyata) — smoke test G4 |
| Performa turun karena search/JS | NFR gagal | Search client-side kecil, index build-time; bundle budget 80KB |

---

## 9. Metrik Success & Review

### 9.1 Instrumentation (Analytics)

| Event | Trigger | Gunanya |
|---|---|---|
| `path_cta_click` | klik "Pilih Jalur Belajar" / "Mulai Belajar" | ukur G1 |
| `material_search` | ketik di search box | cari kebutuhan materi |
| `material_open` | buka lesson |SEQ engagement |
| `lesson_complete_next` | klik "Materi berikutnya" | funnel belajar |
| `theme_toggle` | ganti dark/light | adopsi dark mode |
| `showcase_open` | buka proyek | interaksi showcase |

Tool: **umami** (open-source, self-hostable di GitHub Pages via `umami.is`/Cloudflare) atau GA4 — putuskan di F0. Syarat: **tanpa cookie consent** (first-party only).

### 9.2 Review checklist (sebelum release)

- [ ] 14 route render 200, tidak ada 404 internal
- [ ] Semua link lama (dari `/sitemap` lama & media sosial) masih valid
- [ ] Tidak ada string `example.` / `TODO` / `Lorem` di build output
- [ ] Lighthouse mobile ≥ 90 di homepage, /material, 1 lesson
- [ ] Axe/Lighthouse a11y: 0 critical di 5 halaman sampel
- [ ] Dark mode & light mode pass di semua halaman (mobile + desktop)
- [ ] Struktur heading benar (1 h1) di 14 halaman
- [ ] OG image & preview Slack per halaman utama
- [ ] Copy review: 100% Bahasa Indonesia
- [ ] Build time & bundle size dalam anggaran

---

## 10. Open Questions

1. **Konsep mana?** A / B / C — atau hybrid C + aksen A (rekomendasi saya).
2. **Dark mode wajib?** Jika ya → C jadi pilihan utama.
3. **Search materi:** client-side (tanpa backend) cukup, atau perlu full-text (Pagefind)?
4. **Showcase:** dari mana data nyata? GitHub API repo alumni, atau JSON manual di `src/data/showcase.json`?
5. **Bahasa:** CMD/EN/ID dalam URL? (default EN, sama seperti sekarang)
6. **OG image generator:** statis per kategori, atau statis per materi (build-time screenshot) —|time budget?
7. **Siapa pemilik keputusan desain?** Presumably ketua/team — deadline review mockup?
8. **Apakah halaman "Members" & "Program Kerja" digabung** dengan About untuk/info yang lebih ringkas?
9. **Analytics** — pakai umami self-hosted atau GA4?

---

## 11. Lampiran

### 11.1 Inventaris halaman

| Route | Sumber data | Komponen kunci | Status redesign |
|---|---|---|---|
| `/` | collection blog/materials | Hero, StatsBar, Pillars, PathPicker, RecentMaterials | Prioritas F1 |
| `/material` | collection materials | CategoryCard grid, SearchBox | F3 |
| `/material/[category]` | collection materials | filter kartu | F3 |
| `/material/[category]/[curriculum]` | materials (`type: curriculum`) | CurriculumCard, LessonList, Stepper | F3 |
| `/material/[category]/[curriculum]/[lesson]` | materials | ReadingLayout, TOC, PrevNext, Tabs | F2 |
| `/material/[category]/[slug]` | materials (`type: article`) | ReadingLayout | F2 |
| `/blog`, `/blog/[...slug]` | collection blog | BlogCard, article | F3 |
| `/alumni`, `/alumni/[year]` | `src/data/alumni/*.json` | AlumniCard, YearGrid | F3 |
| `/showcase` | `src/data/showcase.json` (**baru**) | ProjectCard gallery | F3 |
| `/about` | `src/data/about.json` | Timeline, Team | F3 |
| `/members` | `src/data/members.json` | MemberCard | F3 |
| `/program-kerja` | `src/data/program-kerja.json` | ProgramCard + status | F3 |

### 11.2 Audit token Tailwind (yang perlu dirapikan)

| Token saat ini | Masalah | Rencana |
|---|---|---|
| `primary` (#4CAF50) | legacy, bentrok dengan M3 | Ganti ke satu `brand` scale |
| `primary-m3` (#006d3b) | nama tidak semantik | Jadi `primary` tunggal + scale 50–900 |
| `surface-border` | **tidak ada** di config → border tidak render | Ganti `outline-variant` |
| `surface-light` (#F8FAFC) vs `surface` (#f7f9fb) | duplikat nyaris identik | Satukan |
| `slate-dark` (#1F2937) | hardcode-ish | Ganti `inverse-surface` |
| `classic-green`, `android-green` | sisa masa lalu | Hapus |
| — | tidak ada token dark mode | Tambah set dark (`surface`, `on-surface`, `outline`, `primary`) |
| `borderRadius DEFAULT .25rem` | bentrok dengan pilihan konsep (B butuh 16–20px) | Font scale per konsep |

### 11.3 Ringkasan backlog konten

| Item | Jumlah | Prioritas |
|---|---|---|
| Materi `.mdx` tanpa heading/author rapi |_subset_ | Medium |
| File lesson duplikat `-jawaban`/`-latihan` | ~20 file | Medium (tabs di F2) |
| Kategori enum tanpa halaman | 6 (backend, frontend, cyber-security, ai-ml, database, cloud) | Medium |
| Materi lama tanpa gambar | beberapa | Low |
| Data alumni per tahun | 11 file JSON | validated |
| Showcase placeholder | 6 item dummy | **High** (G4) |

---

**Status dokumen:** Draft v1.0 — menunggu keputusan konsep (§10 Q1) sebelum F0 dimulai.
