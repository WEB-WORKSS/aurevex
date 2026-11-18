-- Run in the Supabase SQL editor. Row-level security restricts every row to its owner.
create table if not exists workspaces (id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users on delete cascade, name text, organization text, industry text, size text, use_case text, jurisdictions text, source_count text, priority text, onboarded boolean default false, created_at timestamptz default now());
create table if not exists obligations (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade, t text not null, src text, cl text, dept text, owner text, due date, freq text, st text, risk text, ev text, notes text, created_at timestamptz default now());
create table if not exists sources (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade, title text not null, version text, jurisdiction text, type text, created_at timestamptz default now());
create table if not exists activity (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade, text text, created_at timestamptz default now());
create table if not exists leads (id uuid primary key default gen_random_uuid(), full_name text not null, email text not null, company text, company_size text, use_case text, message text, created_at timestamptz default now());
create table if not exists admins (user_id uuid primary key references auth.users on delete cascade);

alter table workspaces enable row level security; alter table obligations enable row level security;
alter table sources enable row level security; alter table activity enable row level security;
alter table leads enable row level security; alter table admins enable row level security;

create policy "own rows" on workspaces for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on obligations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on sources for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on activity for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "anyone can submit" on leads for insert to anon, authenticated with check (char_length(email) between 5 and 254 and char_length(coalesce(message,'')) < 5000);
-- No select policy on leads/admins: read them from the Supabase dashboard.

create or replace function is_admin() returns boolean language sql security definer set search_path = public as $$ select exists(select 1 from admins where user_id = auth.uid()) $$;
-- Grant founder access to /app:  insert into admins(user_id) select id from auth.users where email = '<founder email>';
