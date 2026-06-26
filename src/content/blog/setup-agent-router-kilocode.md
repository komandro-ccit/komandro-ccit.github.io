---
title: "Tutorial Setup Agent Router untuk KiloCode: Panduan Lengkap dari Nol"
description: "Pelajari cara mendaftar Agent Router, generate API key, dan mengkonfigurasinya di KiloCode untuk mulai coding dengan AI Agent secara gratis."
pubDate: 2026-06-21
author: "Yazid Riziq"
tags: ["ai", "kilocode", "agent-router", "tutorial", "vscode"]
---

Penggunaan AI Agent dalam proses development kini semakin populer. Salah satu cara untuk memanfaatkannya adalah dengan menghubungkan **Agent Router** ke **KiloCode** — ekstensi AI coding assistant di VS Code. Artikel ini akan membimbingmu dari nol hingga siap menggunakan AI Agent untuk coding.

## Apa itu Agent Router?

Agent Router adalah platform yang menyediakan akses ke berbagai AI Model untuk kebutuhan coding. Dengan mendaftar, kamu akan mendapatkan **free balance** yang bisa langsung digunakan tanpa perlu kartu kredit.

## Langkah 1: Registrasi Agent Router

Kunjungi website resmi Agent Router di `https://agentrouter.org/register?aff=ub5S` dan lakukan pendaftaran. Disarankan menggunakan akun GitHub agar prosesnya lebih mudah.

![Halaman Sign Up Agent Router](/images/blog/agent-router/1-continue-with-github.png)

Setelah berhasil masuk, **free balance** akan otomatis tersedia di akunmu. Saldo awal yang diberikan biasanya **$150**, namun pada kondisi tertentu ada juga yang mendapatkan **$175**.

![Saldo Agent Router](/images/blog/agent-router/2-claim-balance.png)

> **Catatan:** Saldo bisa saja bertambah dengan sendirinya. Hal ini mungkin dikarenakan Agent Router masih dalam tahap bagi-bagi *Free Balance*.

## Langkah 2: Generate API Key

Masuk ke menu **API Token** lalu klik tombol **Create token**.

![Menu API Token](/images/blog/agent-router/3-api-token.png)
![Create Token](/images/blog/agent-router/4-create-token.png)

Isi nama token dengan `KiloCode`. Untuk bagian Token grouping, Expiration time, dan New Quantity biarkan default.

![Isi Nama Token](/images/blog/agent-router/5-isi-nama-token.png)

> **Kenapa namanya KiloCode?** Penamaan token bebas, tapi nama "KiloCode" ditujukan agar nama token selaras dengan tujuan dimana API Key tersebut akan dipakai.

Selanjutnya, aktifkan **Unlimited quota** dan bagian Model biarkan default, lalu klik **Submit**.

![Aktifkan Unlimited Quota](/images/blog/agent-router/6-unlimited-and-submit.png)

Token akan muncul setelah klik Submit. *Copy* API Key yang berawalan `sk-xxx...`.

![Get API Key](/images/blog/agent-router/7-api-key.png)

> **Peringatan:** Jangan pernah membagikan API Key kepada orang lain tanpa maksud dan tujuan yang jelas.

## Langkah 3: Konfigurasi di KiloCode (VS Code)

Buka Visual Studio Code dan pastikan ekstensi **KiloCode** sudah terinstal.

![Install KiloCode](/images/blog/agent-router/8-install-kilocode.png)

Setelah terinstall, KiloCode akan tersedia di Sidebar VSCode. Buka panel KiloCode lalu klik **ikon pengaturan**.

![Pengaturan KiloCode](/images/blog/agent-router/9-pengaturan-kilocode.png)

Klik **Providers** dan pilih **Custom Provider**.

![Custom Provider](/images/blog/agent-router/10-custom-provider.png)

Masukkan detail konfigurasi berikut:

| Field | Value |
|-------|-------|
| **Provider ID** | `agentrouter` |
| **Display name** | `Agent Router` |
| **Base URL** | `https://agentrouter.org/v1` |
| **API Key** | *Paste API Key yang kamu dapatkan sebelumnya* |
| **Models** | *Tulis nama model sesuai katalog Agent Router (disarankan pakai Deepseek V4 Pro dan Flash biar hemat)* |

![Setting Provider](/images/blog/agent-router/11-setting-provider.png)
![Setting Provider](/images/blog/agent-router/12-setting-provider2.png)

> **Tips:** Model yang disediakan oleh Agent Router dapat kamu cek pada saat Create Token sebelumnya.

![Models](/images/blog/agent-router/13-models.png)

Simpan pengaturan dengan klik **Submit**. Sekarang KiloCode sudah terhubung ke Agent Router dan siap digunakan!

![Setup di KiloCode](/images/blog/agent-router/14-kilocode-ready.png)

## Contoh Penggunaan: Membuat Aplikasi ToDo List

Setup sudah selesai! Sekarang kita akan coba menggunakan KiloCode untuk membuat aplikasi ToDo List sederhana sebagai demonstrasi.

### Persiapan

Pastikan Provider dan Model dari Agent Router sudah terdeteksi, lalu buat **Folder Project baru** khusus untuk praktek kali ini.

![Persiapan](/images/blog/agent-router/15-tutor1.png)

### Mengenal Mode Agent di KiloCode

KiloCode menyediakan beberapa mode agent yang bisa disesuaikan dengan tugas yang sedang dikerjakan:

![Mode Agent](/images/blog/agent-router/16-tutor2.png)

| Mode | Fungsi |
|------|--------|
| **Code** (Default) | Agen utama yang mengeksekusi aksi dan menulis kode secara langsung. Cocok saat ingin AI langsung membangun struktur proyek. |
| **Ask** | Mode aman untuk sekadar bertanya tanpa mengubah apapun pada *codebase*. |
| **Debug** | Agen untuk analisis sistematis saat menemui *error* atau *bug*. |
| **Plan** | Mode perencanaan arsitektur. Agen hanya mengedit file *plan* dan dilarang mengubah kode utama. |

> **Tips:** Biasakan menggunakan mode **Plan** terlebih dahulu untuk perencanaan, lalu pindah ke mode **Code** saat ingin eksekusi.

### Merencanakan Aplikasi dengan Mode Plan

Klik **Plan** lalu paste prompt berikut:

```prompt
Saya ingin membuat aplikasi To-Do List sederhana. Tolong buatkan perencanaannya.
```

![Prompt Plan](/images/blog/agent-router/17-tutor3.png)

Karena kita menggunakan mode **Plan**, KiloCode tidak akan langsung menulis kode. Sebagai gantinya, ia akan bertindak sebagai asisten perencana dan menanyakan detail tambahan seperti:

- Bahasa pemrograman atau *framework* apa yang akan digunakan?
- Apakah datanya perlu disimpan secara permanen atau hanya sementara?
- Fitur tambahan apa saja yang diperlukan?

![Pertanyaan Agent](/images/blog/agent-router/18-tutor4.png)
![Diskusi dengan Agent](/images/blog/agent-router/19-tutor5.png)
![Hasil Diskusi](/images/blog/agent-router/20-tutor6.png)

Pertanyaan dari agent akan berbeda tergantung model yang dipakai. Setelah review, klik **Submit** untuk melanjutkan.

> **Keunggulan mode Plan:** Kamu bisa berdiskusi, menjawab pertanyaan AI, dan mematangkan konsep arsitektur aplikasi sebelum pindah ke mode **Code** untuk mulai ngoding. KiloCode akan membuatkan file `.md` dalam folder `.kilo` khusus untuk perencanaan.

### Mengeksekusi dengan Mode Code

Setelah plan selesai, cek folder project-mu. Yang tadinya kosong sekarang sudah ada folder `.kilo` berisi file `.md` dengan perencanaan yang akan dieksekusi.

![Folder .kilo](/images/blog/agent-router/22-tutor8.png)

Baca perencanaannya terlebih dahulu. Jika belum sesuai, lanjut prompt lagi hingga perencanaan sesuai sebelum eksekusi.

Jika sudah oke, kembali ke KiloCode dan submit bagian **Continue here** agar tidak pindah sesi. Agent Mode akan otomatis berubah menjadi **Code Mode** — biarkan agent bekerja hingga selesai.

![Eksekusi Code](/images/blog/agent-router/21-tutor7.png)

### Hasil Akhir

Aplikasi siap digunakan! Berikut hasil dari AI Agent model Deepseek V4 Pro dengan pengeluaran biaya sebesar **$0.9265** (Usage Log dapat dilihat pada Dashboard Agent Router).

![Hasil ToDo List](/images/blog/agent-router/23-tutor9.png)
![Tampilan Aplikasi](/images/blog/agent-router/24-tutor10.png)
![Dashboard Usage](/images/blog/agent-router/25-tutor11.png)

## Kesimpulan

Selamat! Kamu telah berhasil mendaftar, mengintegrasikan Agent Router ke dalam KiloCode, dan merancang aplikasi pertamamu dengan bantuan AI Agent.

Setelah memahami alur dasar ini, kamu bisa mulai menerapkan KiloCode pada tugas atau proyek *development* yang lebih kompleks. Namun, ada satu pedoman utama yang harus selalu dipegang:

> **AI Agent hadir untuk membantumu menulis kode lebih cepat, bukan untuk menggantikanmu berpikir.**

Semoga tutorial ini bermanfaat dan bisa membuat alur kerjamu menjadi jauh lebih produktif. Selamat bereksperimen dan *happy coding*!
