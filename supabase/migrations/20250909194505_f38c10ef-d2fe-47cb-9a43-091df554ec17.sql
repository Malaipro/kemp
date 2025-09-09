-- Add email field to participants table
ALTER TABLE public.участники 
ADD COLUMN email text;

-- Add unique constraint to ensure no duplicate emails
ALTER TABLE public.участники 
ADD CONSTRAINT участники_email_unique UNIQUE (email);