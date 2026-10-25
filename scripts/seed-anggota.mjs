#!/usr/bin/env node
/**
 * seed-anggota.mjs — Import roster anggota ke Supabase.
 *
 * Pemakaian:
 *   npm run seed:anggota -- roster.csv
 *
 * CSV header (wajib):
 *   nim,nama,angkatan,jurusan,program,status,foto
 *   - nim:      10-11 digit
 *   - angkatan: 4 digit (mis. 2024)
 *   - status:   aktif | alumni | nonaktif (default: aktif)
 *   - foto:     path/glob lokal (mis. foto/2024/2210512345.jpg) atau URL — opsional
 *
 * Upsert by nim (idempotent). Foto ikut diupload ke bucket foto-anggota.
 */

import { createClient } from '@supabase/supabase-js';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('✗ SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diset di .env');
  process.exit(1);
}

const file = process.argv[2];
if (!file || !existsSync(file)) {
  console.error('✗ Pemakaian: npm run seed:anggota -- <file.csv>');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const NIM_PATTERN = /^\d{10,11}$/;

// --- CSV parser sederhana (dukung quoted values & koma di dalam) -------------
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { field += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      row.push(field); field = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// --- helpers -----------------------------------------------------------------
const recognizedImg = (p) => /\.(jpe?g|png|gif|webp)$/i.test(p);
const extOf = (p) => (path.extname(p).replace('.', '').toLowerCase() || 'jpg')
  .replace('jpeg', 'jpg') === 'jpeg' ? 'jpg' : path.extname(p).replace('.', '').toLowerCase();

function guessMime(ext) {
  return { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' }[ext] ?? 'image/jpeg';
}

async function uploadFoto(sourcePath, nim, angkatan) {
  const ext = extOf(sourcePath);
  const storagePath = `anggota/${angkatan}/${nim}.${ext}`;
  const mime = guessMime(ext);

  let body;
  if (/^https?:\/\//.test(sourcePath)) {
    const res = await fetch(sourcePath);
    if (!res.ok) throw new Error(`URL tidak bisa diunduh (HTTP ${res.status})`);
    body = await res.arrayBuffer();
  } else {
    body = readFileSync(sourcePath);
  }

  const { error } = await supabase.storage
    .from('foto-anggota')
    .upload(storagePath, body, { contentType: mime, upsert: true });
  if (error) throw new Error(`upload foto: ${error.message}`);

  return { foto_path: storagePath, foto_tipe: ext === 'jpeg' ? 'jpg' : ext };
}

// --- ambil nomor urut per angkatan -------------------------------------------
const { data: existing, error: seqErr } = await supabase
  .from('anggota')
  .select('angkatan, nomor_urut');
if (seqErr) {
  console.error('✗ Gagal membaca nomor_urut existing:', seqErr.message);
  process.exit(1);
}
const nextSeq = new Map();
for (const row of existing ?? []) {
  nextSeq.set(row.angkatan, Math.max(nextSeq.get(row.angkatan) ?? 0, row.nomor_urut ?? 0));
}

// --- proses CSV --------------------------------------------------------------
const text = readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const rows = parseCsv(text);
const header = (rows[0] ?? []).map((h) => h.trim().toLowerCase());
const REQUIRED = ['nim', 'nama', 'angkatan', 'jurusan'];
const missing = REQUIRED.filter((r) => !header.includes(r));
if (missing.length) {
  console.error(`✗ Header CSV kurang kolom: ${missing.join(', ')}. Butuh: ${REQUIRED.join(',')}`);
  process.exit(1);
}
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

const summary = { imported: 0, skipped: 0, errors: [], seenNims: new Set() };
const dataRows = rows.slice(1);

for (let i = 0; i < dataRows.length; i++) {
  const row = dataRows[i];
  const rec = {
    nim: (row[idx.nim] ?? '').replace(/[\s\-_.]/g, ''),
    nama: (row[idx.nama] ?? '').trim(),
    angkatan: parseInt(row[idx.angkatan] ?? '', 10),
    jurusan: (row[idx.jurusan] ?? '').trim(),
    program: (row[idx.program] ?? '').trim() || null,
    status: ((row[idx.status] ?? '').trim() || 'aktif').toLowerCase(),
    foto: (row[idx.foto] ?? '').trim(),
  };
  const line = i + 2; // +1 header, +1 humans

  if (!rec.nim && !rec.nama) continue; // baris kosong
  if (!NIM_PATTERN.test(rec.nim)) {
    summary.errors.push({ line, nim: rec.nim, reason: 'NIM tidak 10-11 digit' });
    summary.skipped++;
    continue;
  }
  if (summary.seenNims.has(rec.nim)) {
    summary.errors.push({ line, nim: rec.nim, reason: 'NIM duplikat di file yang sama' });
    summary.skipped++;
    continue;
  }
  if (!Number.isInteger(rec.angkatan) || rec.angkatan < 2014 || rec.angkatan > 2100) {
    summary.errors.push({ line, nim: rec.nim, reason: `angkatan tidak valid: ${row[idx.angkatan]}` });
    summary.skipped++;
    continue;
  }
  if (!['aktif', 'alumni', 'nonaktif'].includes(rec.status)) {
    summary.errors.push({ line, nim: rec.nim, reason: `status tidak dikenal: ${rec.status}` });
    summary.skipped++;
    continue;
  }

  summary.seenNims.add(rec.nim);
  if (!nextSeq.has(rec.angkatan)) nextSeq.set(rec.angkatan, 0);
  const nomorUrut = nextSeq.get(rec.angkatan) + 1;

  const payload = {
    nim: rec.nim,
    nama: rec.nama,
    angkatan: rec.angkatan,
    jurusan: rec.jurusan,
    program: rec.program,
    status: rec.status,
    nomor_urut: nomorUrut,
  };

  try {
    if (rec.foto && recognizedImg(rec.foto)) {
      const foto = await uploadFoto(rec.foto, rec.nim, rec.angkatan);
      payload.foto_path = foto.foto_path;
      payload.foto_tipe = foto.foto_tipe;
    }
  } catch (err) {
    summary.errors.push({ line, nim: rec.nim, reason: `foto: ${err.message}` });
    // lanjut import tanpa foto
  }

  const { error } = await supabase
    .from('anggota')
    .upsert(payload, { onConflict: 'nim' });
  if (error) {
    summary.errors.push({ line, nim: rec.nim, reason: error.message });
    summary.skipped++;
  } else {
    if (nextSeq.get(rec.angkatan) < nomorUrut) nextSeq.set(rec.angkatan, nomorUrut);
    summary.imported++;
  }
}

console.log('\n=== Ringkasan import ===');
console.log(`Imported : ${summary.imported}`);
console.log(`Skipped  : ${summary.skipped}`);
if (summary.errors.length) {
  console.log('\nError/skip per baris:');
  for (const e of summary.errors) {
    console.log(`  baris ${e.line} (NIM ${e.nim}): ${e.reason}`);
  }
  process.exit(2);
}
console.log('✅ Selesai');
