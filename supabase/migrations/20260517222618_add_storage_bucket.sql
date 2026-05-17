insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', true);

create policy "Allow public upload"
on storage.objects for insert
with check ( bucket_id = 'attachments' );

create policy "Allow public read"
on storage.objects for select
using ( bucket_id = 'attachments' );

create policy "Allow public delete"
on storage.objects for delete
using ( bucket_id = 'attachments' );