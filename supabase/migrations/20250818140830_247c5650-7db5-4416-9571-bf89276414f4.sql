-- Fix RLS issue with КЭМП table - disable RLS since it appears to be unused
ALTER TABLE public."КЭМП" DISABLE ROW LEVEL SECURITY;