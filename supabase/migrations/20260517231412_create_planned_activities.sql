create table planned_activities (
  id uuid default gen_random_uuid() primary key,
  activity_id uuid references activities(id) on delete cascade not null,
  date text not null,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table planned_activities enable row level security;

create policy "Allow public read/write access planned_activities"
  on planned_activities
  for all
  using (true)
  with check (true);

alter publication supabase_realtime add table planned_activities;