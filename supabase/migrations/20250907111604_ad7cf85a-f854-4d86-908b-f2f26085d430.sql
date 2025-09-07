-- Fix critical RLS policies for data protection

-- Add RLS policy to prevent public access to contact_submissions
-- Only service_role should read these, and anyone can insert (for contact forms)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow service role read access only" ON public.contact_submissions;

CREATE POLICY "Allow public inserts for contact forms" 
ON public.contact_submissions 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Only admins can read contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add proper RLS policies for service_bookings
-- Remove overly permissive policy and add proper authentication checks
DROP POLICY IF EXISTS "Allow anyone to insert bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Only admins can read service bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Only admins can update service bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Only admins can delete service bookings" ON public.service_bookings;

CREATE POLICY "Allow authenticated users to insert bookings" 
ON public.service_bookings 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can read service bookings" 
ON public.service_bookings 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update service bookings" 
ON public.service_bookings 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete service bookings" 
ON public.service_bookings 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policy for leaderboard (make it publicly readable but not modifiable)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to leaderboard" 
ON public.leaderboard 
FOR SELECT 
TO public
USING (true);

-- Prevent public modifications to leaderboard
CREATE POLICY "Only admins can modify leaderboard" 
ON public.leaderboard 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));