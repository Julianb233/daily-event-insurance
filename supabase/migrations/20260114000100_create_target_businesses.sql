-- Create table for Target Business Registry (Lead Intelligence)
create table if not exists target_businesses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Core Business Info
  business_name text not null,
  website_url text,
  address text,
  city text,
  state text,
  zip_code text,
  
  -- Vertical / Category
  primary_category text, -- e.g. 'Gym', 'Med Spa', 'Event Organizer'
  risk_level text check (risk_level in ('low', 'medium', 'high')), -- Any business with potential liability
  business_model text check (business_model in ('subscription', 'transactional', 'hybrid')), -- Subscription = Higher LTV
  
  -- Intelligence Metrics
  foot_traffic_monthly_avg integer,
  traffic_source text, -- e.g. 'google_places', 'besttime'
  tech_stack text[], -- e.g. ['mindbody', 'wordpress']
  location_count integer default 1, -- "More locations = Better"
  company_size text, -- e.g. '11-50 employees'
  
  -- Scoring (Calculated)
  potential_earnings_annual numeric, -- Estimated $ value
  success_probability_score integer, -- 0-100%
  opportunity_type text check (opportunity_type in ('quick_win', 'whale', 'low_value')), 
  
  -- Owner / Enrichment Status
  owner_name text,
  decision_maker_role text, -- e.g. 'CEO', 'Founder', 'Franchise Owner'
  owner_linkedin_url text,
  owner_email text,
  enrichment_status text default 'pending' check (enrichment_status in ('pending', 'in_progress', 'found', 'not_found')),
  
  -- Outreach / Pipeline Status
  status text default 'new' check (status in ('new', 'qualified', 'contacted', 'in_discussion', 'partnered', 'rejected')),
  
  -- Metadata
  notes text,
  tags text[]
);

-- Enable RLS
alter table target_businesses enable row level security;

-- Policies
create policy "Admins can manage target businesses"
  on target_businesses
  for all
  to authenticated
  using (
    auth.jwt() ->> 'role' = 'admin' 
    or 
    exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
  )
  with check (
    auth.jwt() ->> 'role' = 'admin' 
    or 
    exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
  );

-- Allow service role full access
create policy "Service role has full access"
  on target_businesses
  for all
  to service_role
  using (true)
  with check (true);
