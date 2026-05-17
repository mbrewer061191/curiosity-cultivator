create table activities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  notes text,
  explorer boolean default false,
  artist boolean default false,
  detective boolean default false,
  mapmaker boolean default false,
  "grossMotor" boolean default false,
  "fineMotor" boolean default false,
  outdoor boolean default false,
  "energyLevel" text,
  rating integer default 0,
  "fileName" text,
  "dateAdded" text,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table activities enable row level security;

-- Create a policy that allows anyone to read and write (since we don't have auth yet)
create policy "Allow public read/write access"
  on activities
  for all
  using (true)
  with check (true);

-- Enable Realtime for the table
alter publication supabase_realtime add table activities;