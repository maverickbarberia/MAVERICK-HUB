-- 1. Create the `admins` table
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Insert a default admin account
INSERT INTO public.admins (username, password) 
VALUES ('admin', 'admin123');

-- 3. Enable RLS on admins table (optional but good practice)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 4. Allow reading admins table for the server actions (which run as anon/service)
CREATE POLICY "Enable read for all" 
ON public.admins 
FOR SELECT 
USING (true);
