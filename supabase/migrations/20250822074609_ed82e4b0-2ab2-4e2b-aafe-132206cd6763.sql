-- Fix critical security issue: Remove public access to service_bookings
-- and implement proper role-based access control

-- 1. Remove the dangerous public access policy
DROP POLICY IF EXISTS "Allow public access to bookings for now" ON public.service_bookings;

-- 2. Create role enum for user access control
CREATE TYPE IF NOT EXISTS public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 3. Create user_roles table for role management
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Create secure policies for service_bookings
-- Only admins can read service bookings (protecting customer data)
CREATE POLICY "Only admins can read service bookings" 
ON public.service_bookings 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update/delete service bookings
CREATE POLICY "Only admins can update service bookings" 
ON public.service_bookings 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete service bookings" 
ON public.service_bookings 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Keep the existing insert policy for anonymous bookings
-- (The "Allow anyone to insert bookings" policy already exists and is secure)