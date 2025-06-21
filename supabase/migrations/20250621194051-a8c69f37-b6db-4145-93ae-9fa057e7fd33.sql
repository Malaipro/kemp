
-- Add the missing 'social' column to contact_submissions table
ALTER TABLE public.contact_submissions 
ADD COLUMN social text;
