create extension if not exists vector;
create extension if not exists "uuid-ossp";

-- ========== incidents ==========
create table if not exists incidents (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references auth.users(id),
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open','investigating','resolved','closed')),
  severity text not null default 'medium' check (severity in ('low','medium','high','critical')),
  root_cause text,
  confidence_score numeric(5,2) check (confidence_score >= 0 and confidence_score <= 100),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index if not exists idx_incidents_org_id on incidents(org_id);
create index if not exists idx_incidents_status on incidents(status);

-- ========== chat_history ==========
create table if not exists chat_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id),
  session_id uuid not null,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_chat_history_session on chat_history(session_id);
create index if not exists idx_chat_history_user on chat_history(user_id);

-- ========== ai_memory ==========
create table if not exists ai_memory (
  id uuid primary key default uuid_generate_v4(),
  incident_id uuid references incidents(id) on delete cascade,
  summary text not null,
  resolution text,
  embedding vector(384),
  created_at timestamptz not null default now()
);
create index if not exists idx_ai_memory_incident on ai_memory(incident_id);
create index if not exists idx_ai_memory_embedding
  on ai_memory using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ========== recommendations ==========
create table if not exists recommendations (
  id uuid primary key default uuid_generate_v4(),
  incident_id uuid not null references incidents(id) on delete cascade,
  action_type text not null check (action_type in ('rollback','restart','scale','other')),
  description text not null,
  confidence_score numeric(5,2),
  approved boolean not null default false,
  approved_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists idx_recommendations_incident on recommendations(incident_id);

-- ========== feedback ==========
create table if not exists feedback (
  id uuid primary key default uuid_generate_v4(),
  incident_id uuid not null references incidents(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  rating smallint check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);
create index if not exists idx_feedback_incident on feedback(incident_id);

-- ========== notifications ==========
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id),
  type text not null check (type in ('incident','recommendation','system')),
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_notifications_read on notifications(user_id, read);

-- ========== Row Level Security ==========
alter table incidents enable row level security;
alter table chat_history enable row level security;
alter table ai_memory enable row level security;
alter table recommendations enable row level security;
alter table feedback enable row level security;
alter table notifications enable row level security;

create policy "incidents_select_own_org" on incidents for select using (org_id = auth.uid());
create policy "incidents_insert_own_org" on incidents for insert with check (org_id = auth.uid());
create policy "incidents_update_own_org" on incidents for update using (org_id = auth.uid());

create policy "chat_history_select_own" on chat_history for select using (user_id = auth.uid());
create policy "chat_history_insert_own" on chat_history for insert with check (user_id = auth.uid());

create policy "ai_memory_select_authenticated" on ai_memory for select using (auth.role() = 'authenticated');
create policy "ai_memory_insert_authenticated" on ai_memory for insert with check (auth.role() = 'authenticated');

create policy "recommendations_select_via_incident" on recommendations for select using (
  exists (select 1 from incidents i where i.id = recommendations.incident_id and i.org_id = auth.uid())
);
create policy "recommendations_update_via_incident" on recommendations for update using (
  exists (select 1 from incidents i where i.id = recommendations.incident_id and i.org_id = auth.uid())
);

create policy "feedback_select_own" on feedback for select using (user_id = auth.uid());
create policy "feedback_insert_own" on feedback for insert with check (user_id = auth.uid());

create policy "notifications_select_own" on notifications for select using (user_id = auth.uid());
create policy "notifications_update_own" on notifications for update using (user_id = auth.uid()); 