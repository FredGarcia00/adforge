-- AdForge Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  avatar_url text,
  tier text not null default 'free' check (tier in ('free', 'pro', 'agency')),
  stripe_customer_id text unique,
  videos_this_month integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Videos table
create table public.videos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  prompt text not null,
  video_url text,
  thumbnail_url text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  views integer not null default 0,
  likes integer not null default 0,
  shares integer not null default 0,
  saves integer not null default 0,
  product_name text,
  product_price text,
  product_link text,
  product_benefits text[],
  brand_colors text[],
  avatar_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Product images table
create table public.product_images (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references public.videos on delete cascade not null,
  image_url text not null,
  "order" integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TikTok accounts table
create table public.tiktok_accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  tiktok_username text not null,
  tiktok_user_id text,
  access_token text not null,
  refresh_token text,
  token_expires_at timestamp with time zone,
  connected_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for better query performance
create index videos_user_id_idx on public.videos(user_id);
create index videos_status_idx on public.videos(status);
create index videos_created_at_idx on public.videos(created_at desc);
create index product_images_video_id_idx on public.product_images(video_id);
create index tiktok_accounts_user_id_idx on public.tiktok_accounts(user_id);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.videos enable row level security;
alter table public.product_images enable row level security;
alter table public.tiktok_accounts enable row level security;

-- RLS Policies for users
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- RLS Policies for videos
create policy "Users can view own videos"
  on public.videos for select
  using (auth.uid() = user_id);

create policy "Users can create own videos"
  on public.videos for insert
  with check (auth.uid() = user_id);

create policy "Users can update own videos"
  on public.videos for update
  using (auth.uid() = user_id);

create policy "Users can delete own videos"
  on public.videos for delete
  using (auth.uid() = user_id);

-- RLS Policies for product_images
create policy "Users can view own product images"
  on public.product_images for select
  using (
    exists (
      select 1 from public.videos
      where videos.id = product_images.video_id
      and videos.user_id = auth.uid()
    )
  );

create policy "Users can create product images for own videos"
  on public.product_images for insert
  with check (
    exists (
      select 1 from public.videos
      where videos.id = product_images.video_id
      and videos.user_id = auth.uid()
    )
  );

create policy "Users can delete own product images"
  on public.product_images for delete
  using (
    exists (
      select 1 from public.videos
      where videos.id = product_images.video_id
      and videos.user_id = auth.uid()
    )
  );

-- RLS Policies for tiktok_accounts
create policy "Users can view own TikTok accounts"
  on public.tiktok_accounts for select
  using (auth.uid() = user_id);

create policy "Users can create own TikTok accounts"
  on public.tiktok_accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own TikTok accounts"
  on public.tiktok_accounts for update
  using (auth.uid() = user_id);

create policy "Users can delete own TikTok accounts"
  on public.tiktok_accounts for delete
  using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_users_updated_at
  before update on public.users
  for each row execute procedure public.update_updated_at_column();

create trigger update_videos_updated_at
  before update on public.videos
  for each row execute procedure public.update_updated_at_column();

-- Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Users can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view own product images"
  on storage.objects for select
  using (
    bucket_id = 'product-images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');
