-- Create table for tracking Voice Agent call metrics and outcomes
create table if not exists voice_call_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  phone_number text,
  call_duration_seconds integer,
  
  -- The "Feedback Loop" metrics
  outcome text check (outcome in ('activated', 'qualified_upsell', 'follow_up_needed', 'rejected', 'voicemail')),
  
  -- Qualification Data
  races_per_year integer,
  workouts_per_week integer,
  is_qualified boolean default false,
  
  -- Actions taken
  activation_link_sent boolean default false,
  trigger_link_url text, -- The placeholder for the trigger link
  
  -- Recording
  recording_url text,
  
  -- Metadata
  agent_id text default 'mutual-sales-rep-01',
  notes text,

  -- AI Analysis / Feedback Loop
  sentiment_score integer, -- 1-10 scale
  sentiment_label text check (sentiment_label in ('positive', 'neutral', 'negative')),
  call_summary text,
  transcript_summary text,
  improvement_items jsonb -- Array of strings for feedback loop
);

-- Enable RLS
alter table voice_call_logs enable row level security;

-- Policy: Allow Service Role (Agent) to insert/update
create policy "Service role can manage voice logs"
  on voice_call_logs
  for all
  to service_role
  using (true)
  with check (true);

-- Policy: Allow admins to view
create policy "Admins can view voice logs"
  on voice_call_logs
  for select
  to authenticated
  using (
    auth.jwt() ->> 'role' = 'admin' 
    or 
    exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
  );
