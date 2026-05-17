create table if not exists assessments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  age_group text not null,
  total_score integer not null,
  level text not null,
  system_scores jsonb not null,
  recommended_products text[] not null,
  ai_analysis text
);
