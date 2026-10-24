# DESIGN SPEC — Web Komandro CCIT-FTUI
## Konsep D "Campus Pop" — Style & Visual Language (Konten Dipertahankan)

| Field | Detail |
|---|---|
| **Dokumen** | Design & Style Specification |
| **Versi** | 1.0 — menunggu approval |
| **Tanggal** | 2026-10-24 |
| **Basis** | Konsep D "Campus Pop" (`redesign-mockups/concept-d-campus-pop.html`) |
| **Prinsip utama** | **Struktur tiap page TIDAK berubah** — style/visual berubah, copy diterjemahkan ke Bahasa Indonesia |
| **Status** | Menunggu izin implementasi |

---

## 0.b Keputusan yang Sudah Ditetapkan (2026-10-24)

| # | Keputusan | Nilai | Impact ke scope |
|---|---|---|---|
| K1 | **Bahasa copy** | **Bahasa Indonesia** (diterjemahkan) | Copy sekarang jadi bagian scope — lihat §12 (bukan opsional lagi) |
| K2 | **Dark mode** | **Belum** | Fase F6 dibatalkan; token dark (§1.2) tidak diimplementasi sekarang |
| K3 | **Jumlah warna kategori** | **8 warna, oke** | Pemetaan §1.3 dipakai apa adanya |
| K4 | **Font loading** | **Google Fonts CDN** (bukan self-host) | +2 request Google Fonts; pakai weight Minimum (subset) |
| K5 | **Font yang dipakai** | **"yang sekarang lucu"** → Fredoka + Plus Jakarta Sans + JetBrains Mono | JetBrains Mono dipertahankan, 2 family baru |

> **Catatan K4:** pakai Google Fonts CDN dengan `display=swap` + `preconnect` ke `fonts.googleapis.com` & `fonts.gstatic.com`. Cukup panggil 1 URL dengan `family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700`. **Jangan** request weight yang tidak dipakai (hemat ~20–30KB).

---

## 0. Aturan Main (NON-NEGOTIABLE)

> **Konten ngikutin yang sudah ada di masing-masing page. Ganti style-nya, bukan isinya.**

| Yang TIDAK berubah | Yang Berubah |
|---|---|
| Jumlah, urutan, dan **nama section** di tiap page | Warna, tipografi, spacing, shape, shadow, motion |
| Heading text, body text, CTA text | Background section (putih ↔ colored) |
| Data yang diambil dari `src/data/*.json` & content collections | Card style (border → soft colored) |
| Route/URL | Icon style, hover effect, border radius |
| Jumlah item yang ditampilkan | Typography scale, letter spacing |
| **Struktur komponen** (mis. `CategoryCard`, `AlumniCard`, `SeriesStepper`) | Padding & alignment |
| **Copy language** | ~~English yang sudah ada~~ → **diterjemahkan ke Bahasa Indonesia** (§12) | State visual (hover/focus/active) |

**Exception:** struktur section tetap 1:1, tetapi **copy/heading/CTA diterjemahkan ke Bahasa Indonesia** sesuai keputusan K1. Kode, nama teknologi, dan nama orang **tidak** diterjemahkan.

---

## 1. Design Tokens

### 1.1 Warna — Light Mode (default)

```css
/* Brand — dipakai untuk aksen, CTA, highlight */
--brand-violet:  #6C4DF6; /* primary accent  */
--brand-pink: #FF5C9A; /* secondary accent */
--brand-mint: #12C9A0; /* tertiary accent */
--brand-amber: #FFB020; /* highlight / warning */
--brand-sky: #38B6F7; /* info / 4th accent */
--brand-lime: #A3E635; /* rare */

/* Surface */
--bg-canvas: #FFF9F3; /* background halaman (kertas hangat) */
--bg-card: #FFFFFF; /* kartu */
--bg-soft: #F6F2FF; /* section alternatif (lavender muda) */
--bg-soft-pink:  #FFF0F6;
--bg-soft-mint:  #E4FBF4;
--bg-soft-amber: #FFF4E0;
--bg-soft-sky: #E8F3FF;

/* Text */
--text-primary:  #2A2340;
--text-secondary:#6E6785;
--text-muted: #9A94AE;
--text-inverse:  #FFFFFF;

/* Border */
--border-subtle: rgba(42, 35, 64, 0.08);
--border-strong: rgba(42, 35, 64, 0.14);

/* Dark footer / CTA band */
--ink-band: #2A2340;
```

### 1.2 Warna — Dark Mode (opsional, fase akhir)

```css
--bg-canvas: #171423;
--bg-card: #201B30;
--bg-soft: #241E36;
--text-primary:  #F4F1FB;
--text-secondary:#B3ACC9;
--border-subtle: rgba(255,255,255,.10);
--brand-violet:  #9C83FF;
--brand-pink: #FF8FB8;
--brand-mint: #4DE0BC;
--brand-amber: #FFC85C;
```

> Dark mode **tidak wajib**. Kalau tidak dikerjakan, chip/warna harus tetap kontras di light mode saja.

### 1.3 Pemetaan Aksen ke Kategori Materi

Sistem warna harus konsisten & punya makna. **8 kategori existing** dipetakan:

| Kategori | Aksen | Warna |
|---|---|---|
| Mobile Development | violet | `#6C4DF6` |
| Web Development | sky | `#38B6F7` |
| UI/UX Design | pink | `#FF5C9A` |
| DevOps | mint | `#12C9A0` |
| QA | amber | `#FFB020` |
| IoT | lime | `#A3E635` |
| Tools | orange | `#FF8A3D` |
| Game | magenta | `#D946EF` |

> **8 warna** boleh dipakai bersamaan selama dipisah jelas (kartu/ikon/chip saja, bukan background full-bleed).

### 1.4 Level Kesulitan (Difficulty chip)

Sudah ada mapping di `SeriesMaterialCard.astro` & `SingleMaterialCard.astro`:

| Level | Style | Warna |
|---|---|---|
| Beginner | bg soft-sky, text `#2277B8` | `#E8F3FF` / `#2277B8` |
| Intermediate | bg soft-amber, text `#9A6400` | `#FFF4E0` / `#9A6400` |
| Advanced | bg soft-pink, text `#C4306A` | `#FFEDF4` / `#C4306A` |

---

## 2. Tipografi

### 2.1 Font Family

| Peran | Family | Sumber |
|---|---|---|
| Display (heading, brand) | **Fredoka** (500/600/700) | Google Fonts |
| Body & UI | **Plus Jakarta Sans** (400/500/600/700/800) | Google Fonts |
| Mono (kode, path, metadata) | **JetBrains Mono** (400/700) | Google Fonts (sudah dipakai) |

> Pertimbangan: `Plus Jakarta Sans` + `Fredoka` = 2 request tambahan ke Google Fonts. Sesuai keputusan K4, pakai **Google Fonts CDN** (bukan self-host). Gunakan **satu** `<link>` gabungan + `preconnect` agar tidak menambah round-trip.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

> `display=swap` wajib (mencegah text tak terlihat saat font loading).

### 2.2 Scale

Token Tailwind (`fontFamily`, `fontSize`) — **ganti** yang sekarang:

```js
fontFamily: { display: ['Fredoka', 'system-ui', 'sans-serif'], sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'],
}
```

| Token | Desktop | Mobile | Line-height | Tracking | Weight | Family |
|---|---|---|---|---|---|---|
| `display-xl` | 64px | 40px | 1.06 | -0.03em | 600 | display |
| `display-lg` | 44px | 30px | 1.10 | -0.025em | 600 | display |
| `display-md` | 30px | 24px | 1.16 | -0.02em | 600 | display |
| `display-sm` | 22px | 19px | 1.24 | -0.015em | 600 | display |
| `body-lg` | 18px | 17px | 1.68 | 0 | 400 | sans |
| `body-md` | 16px | 15px | 1.65 | 0 | 400 | sans |
| `body-sm` | 14px | 13.5px | 1.6 | 0 | 500 | sans |
| `label` | 13px | 12px | 1.4 | 0.04em | 700 | sans |
| `mono` | 13px | 12px | 1.55 | 0 | 400 | mono |

**Perubahan vs sekarang:** heading sekarang pakai `Inter` + weight 800 + uppercase tracking. **Baru**: heading pakai `Fredoka` weight 600, **TIDAK uppercase** (kecuali label kecil).

### 2.3 Aturan Pemakaian

- **Heading tidak pernah uppercase.** Uppercase hanya untuk `label` (mis. metadata, chip, nav item kecil).
- Eyebrow/overline (kecil di atas heading): `label` uppercase, `tracking-widest`, warna accent.
- **Maks 2 baris** untuk h1 desktop, **3 baris** mobile. H1 > 42 chars → perkecil ke `display-lg`.
- Body paragraph max-width **68ch** (mobile 100%).
- Copy hero: 1 kalimat value prop + 1 kalimat support. Tidak lebih dari 45 kata.

---

## 3. Spacing, Layout & Grid

### 3.1 Spacing Scale

```js
spacing: { 'base': '8px', 'xs':  '6px', 'sm':  '14px', 'md':  '24px', 'lg':  '48px', 'xl':  '80px', '2xl':'120px', 'container-max': '1160px', 'gutter': '24px', 'margin-desktop': '80px', 'margin-mobile': '24px',
}
```

### 3.2 Section Rhythm

| Tipe section | Padding Y (desktop) | Padding Y (mobile) |
|---|---|---|
| Hero | 80–96px | 56px |
| Section normal | 96px | 60px |
| Section rapat (kartu dense) | 64px | 44px |
| Section CTA band | 88px | 56px |

Section **berganti background** (bukan pakai border line seperti sekarang):
`canvas → soft → canvas → soft → ...` atau `canvas → white → canvas`.

### 3.3 Grid

- Container max **1160px** (dari 1120px), padding 24px mobile / 40px desktop.
- Grid utama: 12 kolom, gap 24px.
- Pola yang dipakai: - 4 kolom → jalur kategori / stat (mobile: 2 → 1) - 3 kolom → kartu materi, kartu blog (mobile: 1) - 2 kolom → pillar, directory (mobile: 1)

### 3.4 Breakpoint

| Nama | Width | Perubahan |
|---|---|---|
| base | < 640 | 1 kolom, radius & shadow lebih kecil, section padding turun |
| sm | 640 | 2 kolom untuk kartu kecil |
| md | 768 | nav desktop muncul, 3 kolom |
| lg | 1024 | 4 kolom, hero 2 kolom, container 1160 |
| xl | 1280 | spacing desktop penuh |

---

## 4. Shape, Shadow, Border

### 4.1 Radius

```js
borderRadius: { 'none': '0px', 'sm':  '10px', 'DEFAULT': '14px', // tombol kecil, chip 'md':  '22px', // card 'lg':  '32px', // card besar, section card 'xl':  '40px', // blob / hero shape 'full':'9999px', // pill, avatar
}
```

### 4.2 Shadow

```js
boxShadow: { 'card': '0 2px 8px rgba(42,35,64,.04)', 'card-md': '0 8px 24px rgba(42,35,64,.08)', 'card-lg': '0 16px 40px rgba(42,35,64,.12)', 'hover': '0 20px 44px rgba(42,35,64,.16)', 'nav': '0 6px 24px rgba(42,35,64,.08)', 'blob': '0 24px 60px rgba(42,35,64,.14)',
}
```

> **Tidak ada** hard shadow (offset solid) — itu milik Konsep E, bukan D.

### 4.3 Border

- Kartu: **tanpa border** (pakai shadow + background) → ini yang bikin kesan modern & playful.
- Border hanya untuk: divider (`rgba(42,35,64,.08)`), input, dan chip berborder.
- `border-surface-border` **dihapus** — token itu memang tidak ada di config sekarang (bug laten).

---

## 5. Motion

```js
transitionTimingFunction: { 'bounce': 'cubic-bezier(.34,1.56,.64,1)',  // hover lift 'smooth': 'cubic-bezier(.4,0,.2,1)', // default
}
```

| Interaksi | Nilai |
|---|---|
| Hover card | `transform: translateY(-4px)` + shadow card→hover, 220ms bounce |
| Hover card (kategori) | + `rotate(-0.6deg)` |
| Hover tombol | `translateY(-2px) scale(1.02)`, shadow card-md |
| Press tombol | `translateY(0) scale(.99)` |
| Link hover | `color` 150ms + underline grow dari kiri |
| Marquee | linear infinite 26s (hanya di hero, opsional) |
| Scroll reveal | fade+up 12px, 500ms, stagger 60ms, **IntersectionObserver** |
| Section transition | tidak ada — cukup ganti background |

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` → matikan semua transform/animasi, marquee, scroll reveal.

---

## 6. Komponen Global

### 6.1 Navbar

**Struktur sekarang:** logo kiri, nav groups (Home / Organization / Resources) dengan dropdown hover, tombol CTA.

**Perubahan style saja:**

```
Desktop:
- tinggi 76px (dari 96px)
- background: rgba(255,255,255,.86) + backdrop-blur(14px)
- bentuk: TIDAK pill penuh — hanya background blur + border-bottom tipis
- logo: mark 40px rounded-[13px] gradient violet→pink, text Fredoka 700
- nav item: font-size 14.5, weight 600, warna text-secondary
- hover: bg lavender muda, radius full
- active: bg lavender muda + teks violet (bukan underline border)
- CTA button: bg violet, radius full, white text

Mobile:
- tombol hamburger di dalam pill bg-white rounded-full (44×44)
- drawer: full-screen overlay, bg canvas, item besar (52px tinggi) + ikon
- dropdown: berubah dari hover → accordion (klik), dengan ikon chevron berputar
```

**Perubahan behavior (wajib,_accessibility):** dropdown pakai `:hover` sekarang → ubah ke **click + `aria-expanded`**, tutup dengan `Escape` atau klik di luar. Ini bagian dari redesign, bukan konten.

### 6.2 Footer

```
- background: --ink-band (#2A2340), bukan slate-dark
- top: blob gradient tipis (violet 12% opacity) di kanan atas
- 4 kolom (brand+desc | directory | resources | contact)
- brand: mark gradient + "Komandro" Fredoka 700 white
- heading kolom: 12.5px uppercase tracking-widest, text-white/45
- link: 15px text-white/75, hover text-amber
- social: pill 40px bg-white/10 → hover bg brand-violet
- bottom bar: border-top white/12, 13px text-white/45
```

### 6.3 Hero Pattern (semua page)

Sekarang: `hero-pattern` = grid line abu. **Baru:**

```
- background: --bg-canvas
- dekorasi: • blob 1: radial violet 18% blur 90px, top-right, 380px • blob 2: radial pink 14% blur 90px, bottom-left, 300px • optional: dotted grid halus (radial-gradient dots 1px, spacing 24px) opacity .35
- padding top: 96px (desktop) / 64px (mobile) — HATI: navbar fixed, pakai pt-28 mobile
```

> Halaman yang sekarang pakai `min-h-[80vh]` → ubah jadi `min-h-[auto]` + padding normal (kecuali `/` yang boleh besar).

### 6.4 Section Header (pola berulang di semua page)

```
overline : 12.5px uppercase tracking-widest, weight 700, warna accent (rotasi antar section: violet → pink → mint → amber)
h2 : display-lg, text-primary
desc : body-lg, text-secondary, max-w-[620px]
underline: LEBAR (dari 96px) DAN TEBAL (dari 4px) — sekarang 96×4, jadi 88×6, radius full, warna accent
```

Perubahan utama: **underline jadi berwarna** (sekarang `bg-primary` monokrom) dan **rotasi warna antar section**.

### 6.5 Card System

3 varian, semua **tanpa border**:

| Varian | Padding | Radius | Shadow | Dipakai di |
|---|---|---|---|---|
| `card-base` | 24px | 22px | card | blog card, material card, alumni card |
| `card-feature` | 28px | 32px | card-md | path/jalur card, showcase card |
| `card-tint` | 24px | 22px | card | tinted background per kategori |

**Hover** (semua): `translateY(-4px)` + shadow hover + (opsional) `rotate(-0.6deg)`.

### 6.6 Icon System

- Tetap **BoxIcons** (`bx-*`) — sudah dipakai di seluruh codebase, konsisten dengan "jangan ganti struktur".
- **Perubahan:** ikon dibungkus **rounded square berwarna**: ``` <div class="w-12 h-12 rounded-[16px] grid place-items-center bg-[soft-tone] text-[22px]"> ```
- **Ikon dalam warna brand** (bukan `text-on-surface` monokrom seperti sekarang) — ini sumber "colorful" paling murah.

### 6.7 Pill / Chip

```
height 28px, padding 0 12px, radius full, font-size 12, weight 700
tone: soft background + saturated text (lihat §1.4)
```

### 6.8 Stats Row

Sekarang: angka besar + label uppercase, tanpa kartu. **Baru:** 4 kartu tinted (ungu/pink/mint/amber), radius 22px, angka `display-lg` weight 700, label `body-sm` weight 600.

---

## 7. Peta Per-Page (struktur existing → style baru)

> **Struktur section tetap 1:1** dengan yang sekarang. Kolom kiri = section yang ada sekarang, kolom kanan = styling baru. Copy ikut diterjemahkan (§12).

### 7.1 `/` — Homepage (`src/pages/index.astro`)

| Section existing | Style baru |
|---|---|
| **Hero** (`min-h-[80vh]`, badge "Est. 2015", h1 "Cultivating the Next Generation of Technology Leaders", p, 2 CTA) | Padding 96px, blob dekor, badge jadi **pill** (abu + dot ungu), h1 `display-xl` Fredoka, h1 tidak uppercase, copy diterjemahkan (§12.2). CTA utama → bg violet radius full + shadow; CTA secondary → bg white + border. Section dipisah dari body pakai border-bottom tipis, bukan `border-surface-border`. |
| **Stats** (4 angka: Years of Excellence, Prestigious Alumni, Technical Workshops, Engineering Projects) | Jadi **4 kartu tinted** (ungu/pink/mint/amber), angka `display-lg`, label jadi `label` uppercase dengan warna text-secondary. Padding 32px, radius 22px, tanpa border. |
| **Core Pillars of Excellence** (3 kolom: Competitive Engineering / Professional Trajectory / Industry Integration, ikon + h3 + p) | 3 kartu tinted (putih + shadow card), **ikon dalam rounded square berwarna** (violet/pink/mint), border-left 4px (sekarang `border-l-4`) **dihapus** → diganti ikon colored. Judul `display-sm`. |
| **Institutional Directory** (kiri deskripsi + "View on Map", kanan 3 blok: Campus Location / Facility / Official Convening) | Layout 1/3 + 2/3 **tetap**. Kiri: h2 `display-lg`, deskripsi, link "View on Map" → **pill button** (bg violet muda + teks violet + arrow). Kanan: 3 blok **tanpa border-top** → kartu putih radius 22px dengan ikon colored + label `label` uppercase + nilai `display-sm`. |
| **Latest from Blog** (3 kartu: hero image, tanggal, author, title, description, "View All Posts") | Kartu **tanpa border**, radius 22px, overflow hidden, image aspect-video rounded-[18px] **di dalam** kartu (bukan flush). Meta row: tanggal & author jadi pill kecil. Judul `display-sm` hover → warna violet. Tombol "View All Posts" → link dengan underline animasi + arrow. |

### 7.2 `/material` — Daftar Kategori

| Yang ada | Style baru |
|---|---|
| Hero "Choose Your Learning Path" | Sama seperti hero homepage: blob + pill overline + `display-xl`. |
| Bento grid 8 `CategoryCard` | Kartu **tinted per kategori** (warna §1.3), radius 32px, **tanpa border**, ikon dalam rounded square bg-white/25, title `display-sm`, description `body-sm`, footer "View Materials" → pill link bg-white/60. Card pertama (Mobile) boleh lebih besar (bento) → struktur grid, cukup bikin 1 kartu span-2 di desktop. |

### 7.3 `/material/[category]`

| Yang ada | Style baru |
|---|---|
| Hero kategori | Konsisten; boleh tambah **accent color per kategori** (violet untuk Mobile, sky untuk Web, dst). |
| "Structured Series" — kartu `SeriesMaterialCard` | Kartu putih radius 22px, tanpa border; **border-left 4px accent kategori** diganti **pill "SERIES"** di kanan atas (bg accent, radius full). Badge "N Modules" jadi `label` text-secondary. Judul `display-sm`. |
| "Single Articles" — kartu `SingleMaterialCard` | Kartu putih radius 22px; badge "TUTORIAL" jadi pill abu; **difficulty chip** jadi pill berwarna (§1.4) — GANTI dari blok rectangular solid. Footer (author • date) dengan border-top tipis. |
| "No Materials Yet" (empty state) | Empty state card: ikon besar dalam lingkaran bg soft + teks + link. |

### 7.4 `/material/[category]/[curriculum]` — Curriculum Index

| Yang ada | Style baru |
|---|---|
| Hero / back navigation | pill back-link "← Back to {category}" + breadcrumb mono. |
| Curriculum Overview Card | Kartu **tinted accent** (soft tone kategori) radius 32px, tanpa border; judul `display-lg`; meta (author, lessons, difficulty) jadi pill. |
| "Course Content" — `SeriesStepper` | Stepper: garis penghubung **3px** warna accent soft; node bulat 36px — completed = bg accent + ikon centang putih; active = bg white + ring accent 3px + glow; future = bg soft + border abu. Label modul `display-sm`. |

### 7.5 `/material/.../[lesson]` — Halaman Baca (`ReadingLayout`)

> **Paling penting & paling harus dipertahankan** — konten materi berat.

| Yang ada | Style baru |
|---|---|
| Header: back link, type badge, h1, author/tanggal/duration | Back link → pill; type badge ("LESSON") → pill accent; h1 `display-lg` (bukan Inter 800); meta row: ikon + teks, dipisah bullet abu. |
| Prerequisites box | Box **tinted mint** radius 22px, tanpa border; ikon centang accent. |
| Article body (`prose`) | `prose` di-override: heading pakai Fredoka (weight 600), body Plus Jakarta Sans 16.5/1.7, link violet + underline, blockquote **tinted lavender** radius 18px + border-left 4px violet, code block bg `#10161A` radius 18px + header file, table header bg soft, gambar radius 18px. |
| Sidebar TOC (sticky) | Card putih radius 22px, sticky, heading "On this page" `label` uppercase, item aktif → pill bg violet muda + teks violet + bar kiri 3px violet. |
| Prev/Next | Dua kartu tinted (prev = soft-sky, next = soft-violet) radius 22px, arrow + label kecil. |
| Tags | Pill berwarna (acak dari palette brand, konsisten per tag). |

### 7.6 `/blog` & `/blog/[...slug]`

| Yang ada | Style baru |
|---|---|
| Blog index: hero + grid 3 kartu | Hero konsisten. Kartu blog: **tanpa border**, radius 22px, image aspect-video rounded-[18px] dengan **overlay gradien** + tag pill di atas image. |
| Blog post: hero (title, date, author, tags) + article | Hero blog: bg soft (tinted) radius 32px di dalam container, bukan full-bleed; title `display-lg`; meta jadi pill. Article: max-width 68ch, `prose` seperti §7.5. |

### 7.7 `/alumni` & `/alumni/[year]`

| Yang ada | Style baru |
|---|---|
| Hero | Konsisten. |
| "Featured Alumni" — 3 `AlumniCard` | Avatar **rounded-[18px]** (bukan lingkaran) dengan **initial letters** + warna acak dari palette; foto alumni tetap. Card tanpa border, radius 22px, shadow card. Badge role jadi **pill** (mapping role: Ketua=violet, Wakil=sky, Sekretaris=mint, Bendahara=amber, Pengurus=soft, Anggota=soft). |
| "Select a Batch Year" | Grid tahun → **pill besar** dengan warna acak, hover scale 1.04. |
| "Study Turtle (Stutle)" | Section tinted mint, ilustrasi/ratio card radius 32px. |
| Sticky year-nav (`sticky top-24`) | Glassmorphism: bg white/85 + blur + border-bottom + radius 0 (mengikuti header) atau pill container. |

### 7.8 `/showcase`

| Yang ada | Style baru |
|---|---|
| Hero | Konsisten. |
| "Design Projects" / "Code Projects" (2 section, grid kartu proyek) | Kartu proyek radius 22px, tanpa border; **gambar besar** aspect-[4/3] rounded-[18px] di atas; overlay gradient di gambar; **type chip** (DESIGN/CODE) pill accent di gambar pojok kiri atas; title `display-sm`; author + batch jadi meta pill. |
| "Regular Updates" | Section tinted, kartu list sederhana. |

### 7.9 `/about`

| Yang ada | Style baru |
|---|---|
| Hero | Konsisten. |
| "Mission & Vision" (2 kartu Misi & Visi) | 2 kartu: Misi = tinted violet, Visi = tinted pink; radius 32px, ikon besar colored, tanpa border. |
| "Timeline of Achievement" (7 milestone dari about.json) | Vertical timeline: **garis 3px** accent gradient (violet→pink→mint), node = lingkaran 20px accent + shadow, tahun `display-sm` accent, judul `display-sm`, deskripsi body-sm. |
| "Current Leadership" (5 anggota) | Kartu anggota: avatar rounded-[18px] initial + nama + role pill. |
| "Visit Us" (Engineering Center, Computer Laboratory, Weekly Assembly) | 3 kartu tinted, ikon colored (bx-map-pin, bx-desktop, bx-time), sama seperti pola Institutional Directory di homepage. |
| "Want to Join Our Team?" (band gelap) | **CTA band** dengan gradient violet→pink, radius 32px, tombol putih, blob dekor. |

### 7.10 `/members`

| Yang ada | Style baru |
|---|---|
| Hero | Konsisten. |
| Grid anggota | Kartu putih radius 22px; avatar **rounded-[18px]** initial + gradient acak; nama `display-sm`; role pill; kontak (LinkedIn) jadi icon button. |
| CTA band | Sama seperti §7.9. |

### 7.11 `/program-kerja`

| Yang ada | Style baru |
|---|---|
| Hero | Konsisten. |
| List program (dari program-kerja.json, ada `status` & `category`) | Kartu **berwarna per kategori** (6 kategori program → 6 warna brand): icon rounded square, nama `display-sm`, deskripsi body-sm, **status pill** (active = mint, completed = abu). Kartu bisa grid 2 kolom. |
| CTA band | Sama. |

---

## 8. Komponen Baru yang Dibutuhkan

Konten **tidak** berubah, tapi butuh komponen pendukung:

| Komponen | File baru | Fungsi |
|---|---|---|
| `SectionHeader.astro` | `src/components/ui/SectionHeader.astro` | overline + h2 + desc + accent underline + warna accent prop |
| `IconBadge.astro` | `src/components/ui/IconBadge.astro` | rounded square berwarna + ikon |
| `Pill.astro` | `src/components/ui/Pill.astro` | chip dengan tone |
| `AccentCard.astro` | `src/components/ui/AccentCard.astro` | card tinted dengan accent color |
| `CTA.astro` | `src/components/ui/CTA.astro` | tombol (primary/secondary) |
| `ThemeToggle.astro` | `src/components/ui/ThemeToggle.astro` | toggle dark mode (opsional) |
| `src/data/categories.json` | — | sumber warna per kategori (dipakai bersama oleh material pages) |

> Komponen existing (`CategoryCard`, `AlumniCard`, `SeriesMaterialCard`, `SingleMaterialCard`, `SeriesStepper`, `ReadingLayout`) **tetap dipakai** — hanya class-nya dirombak.

---

## 9. Migrasi Token Tailwind

### 9.1 Token yang DIHAPUS

| Token | Alasan |
|---|---|
| `primary` (#4CAF50) | legacy, bentrok dengan brand baru |
| `primary-m3`, `on-primary`, `primary-container`, `on-primary-container`, `inverse-primary`, `primary-fixed*`, `tertiary*`, `secondary*`, `surface-container*`, `outline*`, `inverse-*`, `scrim`-like M3 set | set M3 lama, digantikan |
| `classic-green`, `android-green` | sisa masa lalu |
| `surface-border` | **tidak pernah ada** di config (bug) |
| `surface-light`, `surface` (duplikat) | disatukan |
| `slate-dark` | → `ink-band` |

### 9.2 Token BARU

```js
colors: { // brand violet: { DEFAULT:'#6C4DF6', soft:'#F1EBFF', deep:'#4A2FCC' }, pink: { DEFAULT:'#FF5C9A', soft:'#FFEDF4', deep:'#C4306A' }, mint: { DEFAULT:'#12C9A0', soft:'#E4FBF4', deep:'#0A8C6C' }, amber:  { DEFAULT:'#FFB020', soft:'#FFF4E0', deep:'#A06A00' }, sky: { DEFAULT:'#38B6F7', soft:'#E8F3FF', deep:'#2277B8' }, lime: { DEFAULT:'#A3E635', soft:'#F2FDE0', deep:'#5B8A00' }, orange: { DEFAULT:'#FF8A3D', soft:'#FFF0E4', deep:'#B85A17' }, magenta:{ DEFAULT:'#D946EF', soft:'#FBE8FF', deep:'#8E24AA' }, // surface canvas:  '#FFF9F3', card: '#FFFFFF', soft: '#F6F2FF', 'soft-pink':'#FFF0F6', 'soft-mint':'#E4FBF4', 'soft-amber':'#FFF4E0', 'soft-sky':'#E8F3FF', // text ink: '#2A2340', 'ink-2': '#6E6785', 'ink-3': '#9A94AE', // band 'ink-band':'#2A2340',
}
```

### 9.3 Font & Size (lihat §2)

### 9.4 Migration plan token

Semua class hardcoded di file (`bg-slate-50`, `text-gray-800`, `bg-surface-container-low`, `border-surface-border`, `text-on-surface`, `bg-on-background`, `text-primary`, `bg-primary/10`, `text-white/50`) harus dipetakan ke token baru. Ada ~40 file yang perlu disentuh — inventory lengkap ada di §11.

---

## 10. Aksesibilitas & Kualitas

| Item | Target |
|---|---|
| Kontras teks body | ≥ 4.5:1 (`#2A2340` di `#FFF9F3` = 13.9:1 ✅; `#6E6785` = 5.1:1 ✅) |
| Kontras chip | teks saturated di atas soft tone ≥ 4.5:1 (dicek per token) |
| Contrast accent violet `#6C4DF6` di white | 5.2:1 ✅ (boleh untuk text link ≥ 14px bold) |
| Focus ring | `focus-visible:outline-2 outline-offset-2 outline-violet` |
| Target size | min 44×44px untuk semua button/icon-button |
| Dropdown | `aria-expanded`, `aria-controls`, toggle keyboard, tutup `Escape` |
| Heading | 1× h1 per page, hierarki h1→h2→h3 konsisten |
| `prefers-reduced-motion` | semua animasi dimatikan |
| Gambar | `loading="lazy"` + `decoding="async"` + `aspect-ratio` reserved (anti-CLS) |
| Dark mode | jika dikerjakan, kontras diuji per halaman |

---

## 11. Inventory File yang Terdampak

```
layouts/Layout.astro          → navbar wrapper, footer, global style, font import
components/Navbar.astro      → nav + mobile drawer + dropdown behavior
components/AlumniCard.astro  → avatar, role pill, card
components/ImageLightbox.astro → biarkan (fungsional)
components/InternalLink.astro → hanya link color
components/material/CategoryCard.astro → tinted card
components/material/MaterialIcon.astro → biarkan
components/material/ReadingLayout.astro → typography, prose, TOC, prev/next
components/material/SeriesMaterialCard.astro → pill badges
components/material/SeriesStepper.astro → stepper node & line
components/material/SingleMaterialCard.astro → pill badges
pages/  (14 route, Listed di §7)
tailwind.config.cjs           → token rewrite
```

---

## 12. Terjemahan Copy (WAJIB — sesuai keputusan K1)

Semua string UI **diterjemahkan ke Bahasa Indonesia**. Struktur section tetap sama persis; yang berubah hanya teksnya. Istilah teknis, nama teknologi, nama orang, dan nama file **tidak** diterjemahkan.

### 12.1 Navigasi & Footer (global)

| Lokasi | Sekarang (EN) | Jadi (ID) |
|---|---|---|
| Navbar | Home | Beranda |
| Navbar | Organization | Tentang |
| Navbar | About | Tentang Kami |
| Navbar | Members | Anggota |
| Navbar | Programs | Program Kerja |
| Navbar | Alumni | Alumni *(sama)* |
| Navbar | Resources | Belajar |
| Navbar | Materials | Materi |
| Navbar | Blog | Blog *(sama)* |
| Navbar | Showcase | Karya |
| Footer | Directory | Menu |
| Footer | Overview | Beranda |
| Footer | Institution | Tentang |
| Footer | Hall of Fame | Alumni Unggulan |
| Footer | Academic Resources | Materi Belajar |
| Footer | Publications | Blog |
| Footer | Contact | Kontak |
| Footer | Email Correspondence | Surel |
| Footer | Headquarters | Alamat |
| Footer | Privacy Policy | Kebijakan Privasi |
| Footer | Terms of Service | Ketentuan Layanan |

### 12.2 Homepage `/`

| Sekarang (EN) | Jadi (ID) |
|---|---|
| "Est. 2015 • Engineering Excellence" | "Berdiri 2015 • Communities Teknologi" |
| "Cultivating the Next Generation of Technology Leaders" | "Menumbuhkan Generasi Teknologi Masa Depan" |
| "Komunitas Android & Teknologi CCIT-FTUI. We are an institution dedicated to advancing software engineering practice, fostering innovation, and building a prestigious network of technology professionals." | "Komunitas Android & Teknologi CCIT-FTUI. Kami adalah komunitas yang mendedikasikan diri pada kemajuan praktik rekayasa perangkat lunak, mendorong inovasi, dan membangun jaringan profesional teknologi yang prestisius." |
| Explore Programs | Jelajahi Program |
| View Alumni | Lihat Alumni |
| Institutional Impact | Dampak Komunitas |
| "A decade of sustained excellence in technical education, practical engineering, and community building at Universitas Indonesia." | "Satu dekode koordinasi yang konsisten dalam pendidikan teknis, rekayasa praktis, dan pembangunan komunitas di Universitas Indonesia." |
| Years of Excellence | Tahun Dedikasi |
| Prestigious Alumni | Alumni Berprestasi |
| Technical Workshops | Workshop Teknis |
| Engineering Projects | Proyek Rekayasa |
| Core Pillars of Excellence | Pilar Utama |
| Competitive Engineering | Rekayasa Kompetitif |
| Professional Trajectory | Karier Profesional |
| Industry Integration | Integrasi Industri |
| Institutional Directory | Direktori Komunitas |
| "Komandro is headquartered within the Faculty of Engineering at Universitas Indonesia, providing a premier academic environment for technological advancement." | "Komandro berkedudukan di Fakultas Teknik Universitas Indonesia, menyediakan lingkungan akademik unggul untuk kemajuan teknologi." |
| View on Map | Lihat di Peta |
| Campus Location | Lokasi Kampus |
| Facility | Fasilitas |
| Official Convening | Jadwal Rutin |
| Weekly Assembly | Rapat Mingguan |
| Latest from Blog | Terbaru dari Blog |
| "News, updates, and insights from the Komandro community." | "Berita, pembaruan, dan wawasan dari komunitas Komandro." |
| View All Posts | Lihat Semua Artikel |

### 12.3 Halaman Materi

| Lokasi | Sekarang (EN) | Jadi (ID) |
|---|---|---|
| `/material` | Academic Resources | Sumber Belajar |
| `/material` | "Choose Your Learning Path" | "Pilih Jalur Belajar" |
| `/material` | "Master the technical domains required to build the future. Select a specialization below to access structured, developer-centric learning materials." | "Kuasai domain teknis yang dibutuhkan untuk membangun masa depan. Pilih spesialisasi di bawah untuk mengakses materi belajar terstruktur." |
| `/material` | View Materials | Lihat Materi |
| `/material/[category]` | Structured Series | Kurikulum Terstruktur |
| `/material/[category]` | Single Articles | Artikel Tunggal |
| `/material/[category]` | No Materials Yet | Belum Ada Materi |
| `/material/[category]/[curriculum]` | Course Content | Isi Kurikulum |
| `/material/[category]/[curriculum]` | Prerequisites | Prasyarat |
| `/material/[category]/[curriculum]` | "Complete learning curriculum" | "Kurikulum belajar lengkap" |
| lesson | On this page | Di Halaman Ini |
| lesson | Prerequisites | Prasyarat |
| lesson | Tags | Tag |
| lesson | Previous | Sebelumnya |
| lesson | Next | Selanjutnya |
| Series card | SERIES | SERI |
| Single card | TUTORIAL | TUTORIAL *(sama)* |

**Nama kategori** — label tampilan diterjemahkan, **URL tidak diubah**:

| Slug (URL, tetap) | Label EN | Label ID |
|---|---|---|
| `mobile` | Mobile Development | Pengembangan Mobile |
| `web` | Web Development | Pengembangan Web |
| `ui-ux` | UI/UX Design | Desain UI/UX |
| `qa` | Quality Assurance | Jaminan Mutu |
| `devops` | DevOps | DevOps *(sama)* |
| `iot` | Internet of Things | Internet of Things *(sama)* |
| `tools` | Tools | Perkakas |
| `game` | Game Development | Pengembangan Game |

**Level kesulitan**: Beginner → **Pemula**, Intermediate → **Menengah**, Advanced → **Lanjutan**.
→ Butuh file baru `src/data/categories.json` dengan mapping `slug → { label, description, icon, accent }`, dipakai bersama oleh `/material`, `/material/[category]`, dan halaman lesson.

### 12.4 Blog

| Sekarang (EN) | Jadi (ID) |
|---|---|
| Publications | Blog |
| No Posts Yet | Belum Ada Artikel |

### 12.5 Alumni

| Sekarang (EN) | Jadi (ID) |
|---|---|
| Alumni Organization | Organisasi Alumni |
| Alumni Program | Program Alumni |
| Featured Alumni | Alumni Unggulan |
| Select a Batch Year | Pilih Tahun Angkatan |
| Study Turtle (Stutle) | Study Turtle (Stutle) *(sama)* |
| Total Projects | Total Proyek |
| Directory | Direktori |
| Founding Year | Tahun Berdiri |
| Latest Batch | Angkatan Terbaru |
| Lead Backend Engineer | Lead Backend Engineer *(sama)* |
| Lead Frontend Engineer | Lead Frontend Engineer *(sama)* |
| Product Manager | Product Manager *(sama)* |
| View | Lihat |
| Batch 2015 | Batch 2015 *(sama)* |
| No Alumni Data | Belum Ada Data Alumni |
| "Angkatan ini masih berjalan" | *(sama — sudah ID)* |
| Be Part of Our Story | Jadilah Bagian dari Cerita Kami |

### 12.6 About, Members, Program Kerja, Showcase

| Lokasi | Sekarang (EN) | Jadi (ID) |
|---|---|---|
| `/about` | Mission & Vision | Misi & Visi |
| `/about` | Our Mission | Misi Kami |
| `/about` | Our Vision | Visi Kami |
| `/about` | Timeline of Achievement | Perjalanan Jejak |
| `/about` | Current Leadership | Kepemimpinan Saat Ini |
| `/about` | Visit Us | Kunjungi Kami |
| `/about` | Address | Alamat |
| `/about` | Meeting Schedule | Jadwal Rapat |
| `/about` | "Want to Join Our Team?" | "Mau Gabung Bersama Kami?" |
| `/members` | Members | Anggota |
| `/members` | "Want to Be Part of This Team?" | "Mau Jadi Bagian Tim Ini?" |
| `/program-kerja` | Our Programs | Program Kami |
| `/program-kerja` | Programs | Program |
| `/program-kerja` | "Have a New Program Idea?" | "Punya Ide Program Baru?" |
| `/program-kerja` | Active | Aktif |
| `/program-kerja` | Completed | Selesai |
| `/program-kerja` | Planned | Direncanakan |
| `/showcase` | Showcase | Karya |
| `/showcase` | Design Projects | Proyek Desain |
| `/showcase` | Code Projects | Proyek Kode |
| `/showcase` | Regular Updates | Pembaruan Rutin |
| `/showcase` | Projects | Proyek |
| `/showcase` | Total Projects | Total Proyek |

### 12.7 Aturan Terjemahan

1. **Jangan** terjemahkan: nama orang, nama teknologi (Flutter, Docker, Figma), singkatan (UKM, FTUI, UI/UX, API), nama batch ("Batch 2024"), nama kurikulum/materi (dari frontmatter).
2. **Judul materi & blog** (dari `frontmatter`) **TIDAK diterjemahkan** otomatis — itu konten, bukan UI. Kalau mau, harus jadi PR terpisah.
3. **Title case** di English → **sentence case** di Indonesia.
4. Panjang heading Indonesia ≈ 80–110% dari English; nav item maksimal 2 kata supaya navbar tidak berdesakan.
5. Copy panjang (paragraf hero, misi/visi) → tulis ulang natural, bukan terjemahan literal.
6. Semua string yang diubah harus terdaftar di tabel ini — kalau ada string UI yang belum terdaftar, **tanyakan**, jangan menebak.
7. Data JSON (`about.json`, `members.json`, `program-kerja.json`) boleh tetap English bila berisi deskripsi organisatoris, tapi **field yang tampil sebagai label/heading** wajib ikut diterjemahkan.

---

## 13. Keputusan yang Sudah Ditutup

| # | Pertanyaan | Jawaban |
|---|---|---|
| 1 | Copy: English atau Indonesia? | **Indonesia** — lihat §12 |
| 2 | Dark mode? | **Belum** — tidak dikerjakan di fase ini |
| 3 | Breadcrumb / internal link label? | **Indonesia**, mengikuti §12 |
| 4 | Warna kategori: 8 atau 4? | **8 warna** — dipakai apa adanya |
| 5 | Font loading? | **Google Fonts CDN** (bukan self-host) |
| 6 | Font mana? | **Fredoka + Plus Jakarta Sans + JetBrains Mono** (yang "lucu") |

### 13.1 Sisa hal yang perlu dikonfirmasi saat implementasi (bukan blocker)

| Hal | Default yang akan dipakai |
|---|---|
| Blob dekor blur 90px di mobile low-end | 1 blob saja di mobile, 2 di desktop |
| `prefers-reduced-motion` | wajib — matikan marquee & scroll reveal |
| Dark mode toggle di UI | **tidak ada** (K2) |
| Prisma / shiki code theme | tetap `github-dark` (biarkan) |

---

## 14. Deliverable & Tahapan (setelah disetujui)

| Fase | Isi | Estimasi |
|---|---|---|
| F0 | Token Tailwind baru + font + `SectionHeader`/`IconBadge`/`Pill`/`CTA` + global CSS | 2–3 hari |
| F1 | Layout + Navbar + Footer baru (semua 14 page langsung ter-impact) | 2 hari |
| F2 | Homepage (`/`) end-to-end sesuai §7.1 | 1–2 hari |
| F3 | Halaman materi: `/material`, `[category]`, curriculum, **ReadingLayout** | 3–4 hari |
| F4 | Blog, Alumni, Showcase, About, Members, Program Kerja | 3–4 hari |
| F5 | QA: responsif 5 breakpoint, kontras, a11y, Lighthouse, copy check | 2–3 hari |
| F6 | ~~Dark mode~~ — **dibatalkan** (keputusan K2) | — |

**Total: ±13–18 hari kerja.**

> Tahapan F0–F5 sudah mencakup seluruh scope yang disetujui. Dark mode tidak termasuk.

---

**Status: menunggu persetujuan implementasi.**
