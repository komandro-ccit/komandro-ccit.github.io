-- Storage bucket foto-anggota (private) + policy untuk service_role
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('foto-anggota', 'foto-anggota', false, 2097152,
        array['image/jpeg','image/png','image/gif','image/webp'])
on conflict (id) do nothing;

-- Policy: hanya service_role yang boleh upload & baca (RLS Storage).
create policy "service role full access foto-anggota"
on storage.objects for all to service_role
using (bucket_id = 'foto-anggota')
with check (bucket_id = 'foto-anggota');
