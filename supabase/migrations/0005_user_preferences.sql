create table if not exists user_preferences (
  user_id uuid primary key references auth.users(id),
  slack_channel text,
  email_enabled boolean not null default true,
  slack_enabled boolean not null default false
);
alter table user_preferences enable row level security;
create policy "user_preferences_own" on user_preferences for all using (user_id = auth.uid());