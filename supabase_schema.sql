-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
-- Links to auth.users via id
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  plan_tier text default 'base', -- 'base' | 'premium'
  context_completed boolean default false,
  context_pdf_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- PROMPTS (Library Content)
create table prompts (
  id serial primary key,
  title text not null,
  slug text unique not null,
  category_situation text not null,
  category_niche text not null,
  is_premium boolean default false,
  description_short text,
  description_full text,
  content_template text, -- The prompt text itself
  usage_instructions text,
  example_output text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- OPTIMIZATIONS (History)
create table optimizations (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  prompt_id integer references prompts(id),
  input_context text,
  output_result text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS POLICIES (Security)

-- Profiles
alter table profiles enable row level security;

create policy "Users can view own profile" 
  on profiles for select 
  using ( auth.uid() = id );

create policy "Users can update own profile" 
  on profiles for update 
  using ( auth.uid() = id );

-- Prompts
alter table prompts enable row level security;

create policy "Prompts are viewable by everyone" 
  on prompts for select 
  using ( true );

-- Optimizations
alter table optimizations enable row level security;

create policy "Users can view own optimizations" 
  on optimizations for select 
  using ( auth.uid() = user_id );

create policy "Users can create optimizations" 
  on optimizations for insert 
  with check ( auth.uid() = user_id );

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE BUCKET
insert into storage.buckets (id, name, public) 
values ('contexts', 'contexts', false);

create policy "Users can upload their own context"
on storage.objects for insert
with check ( bucket_id = 'contexts' and auth.uid() = owner );

create policy "Users can read their own context"
on storage.objects for select
using ( bucket_id = 'contexts' and auth.uid() = owner );
