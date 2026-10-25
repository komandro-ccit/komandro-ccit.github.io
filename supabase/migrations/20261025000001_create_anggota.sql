-- Kartu Keanggotaan Digital — schema v1
create extension if not exists "pgcrypto";

create table public.anggota (
  id             uuid primary key default gen_random_uuid(),
  nim            text        not null unique,
  nama           text        not null,
  angkatan       int         not null check (angkatan between 2014 and 2100),
  jurusan        text        not null,
  status         text        not null default 'aktif'
                   check (status in ('aktif', 'alumni', 'nonaktif')),
  program        text,
  foto_path      text,
  foto_tipe      text check (foto_tipe in ('jpg', 'jpeg', 'png', 'gif', 'webp')),
  nomor_urut     int,                       -- per angkatan, untuk cardId
  dibuat_pada    timestamptz not null default now(),
  diperbarui_pada timestamptz not null default now()
);

create index anggota_angkatan_idx on public.anggota (angkatan);
create index anggota_status_idx on public.anggota (status);

create table public.penggunaan_lookup (
  id         bigint generated always as identity primary key,
  ip_hash    text        not null,
  created_at timestamptz not null default now()
);
create index penggunaan_lookup_ip_idx on public.penggunaan_lookup (ip_hash, created_at desc);

-- RLS: tolak semua akses anon/authenticated langsung.
-- Hanya service_role (Edge Function) yang boleh membaca.
alter table public.anggota enable row level security;
alter table public.penggunaan_lookup enable row level security;
-- Tidak ada policy => anon & authenticated tidak bisa apa-apa.
