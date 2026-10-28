/**
 * Data anggota DEMO (fiktif) — dipakai ketika Supabase belum dikonfigurasi.
 * Diganti otomatis dengan data asli begitu PUBLIC_SUPABASE_URL tersedia.
 */
import type { MemberPayload } from './memberLookup';

export const ANGGOTA_DEMO: Array<{ nim: string } & MemberPayload> = [
  {
    nim: '2210512345',
    nama: 'Citra Maharani',
    angkatan: 2022,
    jurusan: 'D3 Teknologi Komputer',
    status: 'aktif',
    program: 'Bootcamp 2024 · Mobile Development',
    fotoUrl: null,
    fotoTipe: null,
    cardId: 'KMD-2022-0042',
  },
  {
    nim: '2210512346',
    nama: 'Joko Prasetyo',
    angkatan: 2022,
    jurusan: 'Sistem Informasi',
    status: 'aktif',
    program: 'Bootcamp 2024 · Web Development',
    fotoUrl: null,
    fotoTipe: null,
    cardId: 'KMD-2022-0043',
  },
  {
    nim: '1910511001',
    nama: 'Dewi Anggraini',
    angkatan: 2019,
    jurusan: 'Teknik Elektro',
    status: 'alumni',
    program: 'Bootcamp 2019 · Android Native',
    fotoUrl: null,
    fotoTipe: null,
    cardId: 'KMD-2019-0007',
  },
  {
    nim: '2310517777',
    nama: 'Rizky Ramadhan',
    angkatan: 2023,
    jurusan: 'D3 Sistem Informasi',
    status: 'aktif',
    program: 'Bootcamp 2024 · UI/UX Design',
    fotoUrl: null,
    fotoTipe: null,
    cardId: 'KMD-2023-0111',
  },
];
