-- Add personal data fields to participants table
ALTER TABLE public.участники 
ADD COLUMN height_cm integer,
ADD COLUMN weight_kg integer,
ADD COLUMN birth_date date;