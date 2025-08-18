-- Fix security vulnerability: Remove public read access to contact_submissions
-- Only allow service role and authenticated admins to read contact submissions

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Allow service role to read all submissions" ON public.contact_submissions;

-- Create a new restrictive policy that only allows service role access
-- This ensures only backend systems and authorized admin users can read submissions
CREATE POLICY "Allow service role read access only" 
ON public.contact_submissions 
FOR SELECT 
USING (
  -- Only allow if the request is made with service role key
  -- or if user has admin role (when user roles are implemented)
  auth.jwt() ->> 'role' = 'service_role'
);

-- Keep the anonymous insert policy as it's needed for the contact form
-- This policy remains: "Allow anonymous inserts" for INSERT with true check