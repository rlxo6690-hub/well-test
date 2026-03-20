-- Alumni Connect DB Schema
-- Supabase SQL Editor에서 실행하세요

-- 사용자 프로필 테이블
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  cohort integer,
  nickname text unique,
  role text not null default 'pending', -- pending | member | class_leader | admin
  certificate_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 신규 유저 가입 시 profiles 자동 생성 트리거
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 닉네임 자동 생성 함수 (동명이인 처리 포함)
create or replace function public.generate_nickname(p_cohort integer, p_name text)
returns text as $$
declare
  base_nick text;
  final_nick text;
  counter integer := 0;
begin
  base_nick := p_cohort::text || '_' || p_name;
  final_nick := base_nick;

  loop
    if not exists (select 1 from public.profiles where nickname = final_nick) then
      return final_nick;
    end if;
    counter := counter + 1;
    final_nick := base_nick || '_' || counter::text;
  end loop;
end;
$$ language plpgsql;

-- RLS 활성화
alter table public.profiles enable row level security;

-- RLS 정책
-- 본인 프로필 조회
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 승인된 멤버는 타인 프로필 조회 가능
create policy "Approved members can view others"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role != 'pending'
    )
  );

-- 본인 프로필 업데이트 (name, cohort, certificate_url만)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admin만 role 변경 가능 (별도 함수로 처리)
create policy "Admins can update any profile"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
