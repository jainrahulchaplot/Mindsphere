-- === MindSphere Schema (MVP) ===
-- Tables
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id bigserial primary key,
  user_id uuid,
  mood text,
  duration int,
  script text,
  created_at timestamptz default now()
);

create table if not exists journals (
  id bigserial primary key,
  user_id uuid,
  session_id bigint,
  text text,
  summary jsonb,
  created_at timestamptz default now()
);

create table if not exists streaks (
  id bigserial primary key,
  user_id uuid,
  current_streak int default 0,
  best_streak int default 0,
  last_completed date
);

-- Background music playlist
create table if not exists music_tracks (
  id bigserial primary key,
  title text not null,
  url text not null,        -- public URL to the mp3 in Supabase Storage
  sort_order int default 1,
  created_at timestamptz default now()
);

-- RPC to update streak on completion
create or replace function update_streak_on_completion(p_date date)
returns void language plpgsql as $$
declare s record; begin
  select * into s from streaks limit 1;
  if s is null then 
    insert into streaks(current_streak,best_streak,last_completed) values (1,1,p_date);
    return; 
  end if;
  if s.last_completed = p_date then return; end if;
  if s.last_completed = p_date - 1 then
    update streaks set current_streak = s.current_streak + 1,
      best_streak = greatest(best_streak, s.current_streak + 1),
      last_completed = p_date where id=s.id;
  else
    update streaks set current_streak = 1, last_completed = p_date where id=s.id;
  end if;
end;$$;