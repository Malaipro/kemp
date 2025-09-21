-- Полная миграция для проекта jbotyvommxeoyhrmdfic
-- Выполните этот скрипт в SQL Editor: https://supabase.com/dashboard/project/jbotyvommxeoyhrmdfic/sql/new

-- Создание пользовательских типов
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.activity_type_new AS ENUM ('training', 'lecture', 'homework', 'crash_test_bjj', 'crash_test_kick', 'heroes_race', 'tactics', 'ascetic');
CREATE TYPE public.lecture_subtype AS ENUM ('kemp', 'nutrition', 'psychology', 'philosophy', 'leadership', 'tactics');
CREATE TYPE public.reward_type AS ENUM ('zakal', 'gran', 'shram');
CREATE TYPE public.shram_subtype AS ENUM ('bjj', 'kick', 'ofp', 'tactics');
CREATE TYPE public.totem_type AS ENUM ('snake', 'paw', 'hammer', 'blade');
CREATE TYPE public.training_subtype AS ENUM ('bjj', 'kick', 'ofp');
CREATE TYPE public.zakal_subtype AS ENUM ('bjj', 'kick', 'ofp');

-- Создание таблиц
CREATE TABLE public.achievement_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  shape TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.admin_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID,
  table_name TEXT NOT NULL,
  action TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.contact_rate_limit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  submission_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  course TEXT NOT NULL,
  social TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.intensive_streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.участники (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  birth_date DATE,
  height_cm INTEGER,
  weight_kg INTEGER,
  points INTEGER NOT NULL DEFAULT 0,
  stream_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.кэмп_активности (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL,
  activity_type_new activity_type_new,
  reward_type reward_type NOT NULL,
  zakal_subtype zakal_subtype,
  shram_subtype shram_subtype,
  training_subtype training_subtype,
  lecture_subtype lecture_subtype,
  points INTEGER NOT NULL DEFAULT 1,
  multiplier NUMERIC DEFAULT 1.0,
  auto_points INTEGER DEFAULT 1,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  verified_by TEXT,
  attendance_counted BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.аскезы_участников (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL DEFAULT 14,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.тотемы_участников (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL,
  totem_type totem_type NOT NULL,
  requirements_met JSONB,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.cooper_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL,
  test_number INTEGER NOT NULL DEFAULT 1,
  distance_meters INTEGER NOT NULL,
  time_minutes INTEGER NOT NULL DEFAULT 12,
  completion_time_seconds INTEGER,
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  fitness_level TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создание функций
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    WHERE u.id = _user_id
      AND u.email = 'dishka.da@yandex.ru'
      AND ur.role = 'admin'
  )
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Назначаем роль admin для dishka.da@yandex.ru, остальным - user
  IF NEW.email = 'dishka.da@yandex.ru' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_participant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Создаем запись участника для нового пользователя
  INSERT INTO public.участники (user_id, name, last_name, points)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'Новый участник'),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    0
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(p_ip_address inet)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_count INTEGER := 0;
  time_window INTERVAL := '1 hour';
  max_submissions INTEGER := 5;
BEGIN
  SELECT COALESCE(SUM(submission_count), 0)
  INTO current_count
  FROM public.contact_rate_limit
  WHERE ip_address = p_ip_address
    AND window_start > (NOW() - time_window);
  
  IF current_count >= max_submissions THEN
    RETURN FALSE;
  END IF;
  
  INSERT INTO public.contact_rate_limit (ip_address, submission_count, window_start)
  VALUES (p_ip_address, 1, NOW())
  ON CONFLICT (ip_address) 
  DO UPDATE SET 
    submission_count = contact_rate_limit.submission_count + 1,
    window_start = CASE 
      WHEN contact_rate_limit.window_start < (NOW() - time_window) 
      THEN NOW() 
      ELSE contact_rate_limit.window_start 
    END;
  
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Создание триггеров
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_participant_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_participant();

CREATE TRIGGER update_intensive_streams_updated_at
  BEFORE UPDATE ON public.intensive_streams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cooper_test_results_updated_at
  BEFORE UPDATE ON public.cooper_test_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Включение RLS для всех таблиц
ALTER TABLE public.achievement_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_rate_limit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intensive_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.участники ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.кэмп_активности ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.аскезы_участников ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.тотемы_участников ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooper_test_results ENABLE ROW LEVEL SECURITY;

-- Создание политик RLS
CREATE POLICY "Allow public read access for achievement_types" ON public.achievement_types FOR SELECT USING (true);

CREATE POLICY "Allow public read access for activities" ON public.activities FOR SELECT USING (true);

CREATE POLICY "Only super admin can access logs" ON public.admin_access_log FOR SELECT USING (is_super_admin(auth.uid()));

CREATE POLICY "Public can insert rate limit entries" ON public.contact_rate_limit FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update rate limit entries" ON public.contact_rate_limit FOR UPDATE USING (true);

CREATE POLICY "Only admins can read contact submissions" ON public.contact_submissions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Validated public contact inserts" ON public.contact_submissions FOR INSERT 
WITH CHECK (
  length(TRIM(BOTH FROM name)) >= 2 
  AND length(TRIM(BOTH FROM phone)) >= 10 
  AND length(TRIM(BOTH FROM course)) > 0
  AND check_contact_rate_limit(COALESCE((current_setting('request.headers', true)::json->>'x-forwarded-for')::inet, inet_client_addr()))
);

CREATE POLICY "Allow public read access for active streams" ON public.intensive_streams FOR SELECT USING (is_active = true);
CREATE POLICY "Super admin can manage all streams" ON public.intensive_streams FOR ALL USING (is_super_admin(auth.uid())) WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own participant" ON public.участники FOR SELECT USING (auth.uid() = user_id AND NOT is_super_admin(auth.uid()));
CREATE POLICY "Users can create their own participant" ON public.участники FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT is_super_admin(auth.uid()));
CREATE POLICY "Users can update their own participant" ON public.участники FOR UPDATE USING (auth.uid() = user_id AND NOT is_super_admin(auth.uid())) WITH CHECK (auth.uid() = user_id AND NOT is_super_admin(auth.uid()));
CREATE POLICY "Super admin can manage all participants" ON public.участники FOR ALL USING (is_super_admin(auth.uid())) WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Users can view their own kamp activities" ON public.кэмп_активности FOR SELECT USING (participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid()) AND NOT is_super_admin(auth.uid()));
CREATE POLICY "Super admin can manage all kamp activities" ON public.кэмп_активности FOR ALL USING (is_super_admin(auth.uid())) WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Users can manage their own ascetics" ON public.аскезы_участников FOR ALL USING (participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid())) WITH CHECK (participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own totems" ON public.тотемы_участников FOR SELECT USING (participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own Cooper test results" ON public.cooper_test_results FOR SELECT USING (participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert their own Cooper test results" ON public.cooper_test_results FOR INSERT WITH CHECK (participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their own Cooper test results" ON public.cooper_test_results FOR UPDATE USING (participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid()));
CREATE POLICY "Super admin can manage all Cooper test results" ON public.cooper_test_results FOR ALL USING (is_super_admin(auth.uid()));

-- Вставка тестовых данных
INSERT INTO public.intensive_streams (id, name, description, start_date, end_date, is_active, is_current) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Интенсив №1', 'Первый поток интенсива', '2024-01-01', '2024-01-14', true, false),
('550e8400-e29b-41d4-a716-446655440001', 'Интенсив №2', 'Второй поток интенсива', '2024-02-01', '2024-02-14', true, true);