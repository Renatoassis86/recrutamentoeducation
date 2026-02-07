-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create types
create type app_role as enum ('candidate', 'admin');
create type app_status as enum ('received', 'under_review', 'info_requested', 'interview_invited', 'closed');

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role app_role not null default 'candidate',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- APPLICATIONS
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status app_status not null default 'received',
  
  -- Personal Data
  full_name text not null,
  email text not null,
  phone text,
  city text,
  state text,
  
  -- Profile & Education
  profile_type text not null, -- 'licenciado' | 'pedagogo'
  licensure_area text, -- if licenciado
  pedagogy_areas text[], -- if pedagogo
  
  graduation_course text,
  graduation_institution text,
  graduation_year int,
  postgrad_areas text[], -- checkboxes
  
  -- Experience
  experience_years text,
  experience_summary text,
  
  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- DOCUMENTS
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  application_id uuid references public.applications(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null, -- denormalized for RLS speed
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default now()
);

-- MESSAGES
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  application_id uuid references public.applications(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete restrict not null,
  sender_role app_role not null,
  subject text,
  body text not null,
  is_read boolean default false,
  created_at timestamptz not null default now()
);

-- AUDIT LOG
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_resource text not null,
  target_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

-- EMAIL LOG
create table public.email_logs (
  id uuid default uuid_generate_v4() primary key,
  application_id uuid references public.applications(id) on delete set null,
  recipient_email text not null,
  template_key text not null,
  status text not null, -- 'sent', 'failed'
  provider_id text,
  created_at timestamptz not null default now()
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.documents enable row level security;
alter table public.messages enable row level security;
alter table public.audit_logs enable row level security;
alter table public.email_logs enable row level security;

-- PROFILES POLICIES
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- APPLICATIONS POLICIES
create policy "Candidates can view own applications" on public.applications
  for select using (auth.uid() = user_id);

create policy "Candidates can create applications" on public.applications
  for insert with check (auth.uid() = user_id);

create policy "Candidates can update own applications if allowed" on public.applications
  for update using (auth.uid() = user_id); 
  -- In application logic, check status before update. RLS is broad here.

create policy "Admins can view all applications" on public.applications
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update all applications" on public.applications
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- DOCUMENTS POLICIES
create policy "Candidates can view own documents" on public.documents
  for select using (auth.uid() = user_id);

create policy "Candidates can insert own documents" on public.documents
  for insert with check (auth.uid() = user_id);

create policy "Admins can view all documents" on public.documents
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- MESSAGES POLICIES
create policy "Users can view messages for their application" on public.messages
  for select using (
    exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())
    or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can insert messages" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and
    (
      exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())
      or
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    )
  );

-- TRIGGER FOR NEW USER -> PROFILE
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'candidate');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE POLICIES (Note: Storage policies are set in the dashboard usually, but can be done via SQL too if enabled)
-- Requires enabling 'storage' schema access. Assuming standard bucket 'candidaturas'.
-- We will document this to be set up manually or via another migration if the user has storage extension enabled in SQL.
