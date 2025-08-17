-- Add user_id column to participants table to link with auth.users
ALTER TABLE public.participants 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add index for better performance on user_id lookups
CREATE INDEX idx_participants_user_id ON public.participants(user_id);

-- Update RLS policies for participants table
DROP POLICY IF EXISTS "Allow public read access for participants" ON public.participants;

-- Allow authenticated users to read all participants (for leaderboard)
CREATE POLICY "Allow authenticated users to read participants"
ON public.participants
FOR SELECT
TO authenticated
USING (true);

-- Allow users to update their own participant record
CREATE POLICY "Allow users to update their own participant"
ON public.participants
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own participant record
CREATE POLICY "Allow users to create their own participant"
ON public.participants
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Update RLS policies for user_achievements to be user-specific
DROP POLICY IF EXISTS "Allow public read access for user_achievements" ON public.user_achievements;

CREATE POLICY "Allow users to read their own achievements"
ON public.user_achievements
FOR SELECT
TO authenticated
USING (
  participant_id IN (
    SELECT id FROM public.participants WHERE user_id = auth.uid()
  )
);

-- Update RLS policies for user_special_badges to be user-specific  
DROP POLICY IF EXISTS "Allow public read access for user_special_badges" ON public.user_special_badges;

CREATE POLICY "Allow users to read their own special badges"
ON public.user_special_badges
FOR SELECT
TO authenticated
USING (
  participant_id IN (
    SELECT id FROM public.participants WHERE user_id = auth.uid()
  )
);

-- Update RLS policies for direction_progress to be user-specific
DROP POLICY IF EXISTS "Allow public read access for direction_progress" ON public.direction_progress;

CREATE POLICY "Allow users to read their own direction progress"
ON public.direction_progress
FOR SELECT
TO authenticated
USING (
  participant_id IN (
    SELECT id FROM public.participants WHERE user_id = auth.uid()
  )
);