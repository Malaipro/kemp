-- ================================================
-- ПОЛНЫЙ ЭКСПОРТ ДЛЯ ПЕРЕНОСА В НОВЫЙ ПРОЕКТ SUPABASE
-- ================================================

-- 1. СОЗДАНИЕ ТИПОВ
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.activity_type_new AS ENUM ('training', 'lecture', 'homework', 'crash_test_bjj', 'crash_test_kick', 'heroes_race', 'tactics', 'ascetic');
CREATE TYPE public.lecture_subtype AS ENUM ('kemp', 'nutrition', 'medicine', 'philosophy', 'psychology');
CREATE TYPE public.reward_type AS ENUM ('zakal', 'gran', 'shram');
CREATE TYPE public.shram_subtype AS ENUM ('bjj', 'kick', 'ofp', 'tactics');
CREATE TYPE public.totem_type AS ENUM ('snake', 'paw', 'hammer', 'blade');
CREATE TYPE public.training_subtype AS ENUM ('bjj', 'kick', 'ofp');
CREATE TYPE public.zakal_subtype AS ENUM ('bjj', 'kick', 'ofp');

-- 2. СОЗДАНИЕ ТАБЛИЦ

-- achievement_types
CREATE TABLE public.achievement_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    shape TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- activities  
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- admin_access_log
CREATE TABLE public.admin_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID,
    table_name TEXT NOT NULL,
    action TEXT NOT NULL,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ip_address INET,
    user_agent TEXT
);

-- contact_rate_limit
CREATE TABLE public.contact_rate_limit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET NOT NULL UNIQUE,
    submission_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- contact_submissions
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    course TEXT NOT NULL,
    social TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- intensive_streams
CREATE TABLE public.intensive_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- участники
CREATE TABLE public.участники (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- user_roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- кэмп_активности
CREATE TABLE public.кэмп_активности (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL,
    activity_type_new activity_type_new,
    reward_type reward_type NOT NULL,
    zakal_subtype zakal_subtype,
    shram_subtype shram_subtype,
    training_subtype training_subtype,
    lecture_subtype lecture_subtype,
    points INTEGER NOT NULL DEFAULT 1,
    auto_points INTEGER DEFAULT 1,
    multiplier NUMERIC DEFAULT 1.0,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    verified_by TEXT,
    attendance_counted BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- аскезы_участников
CREATE TABLE public.аскезы_участников (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- тотемы_участников
CREATE TABLE public.тотемы_участников (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL,
    totem_type totem_type NOT NULL,
    requirements_met JSONB,
    earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- cooper_test_results
CREATE TABLE public.cooper_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL,
    test_date DATE NOT NULL DEFAULT CURRENT_DATE,
    distance_meters INTEGER NOT NULL,
    time_minutes INTEGER NOT NULL DEFAULT 12,
    completion_time_seconds INTEGER,
    fitness_level TEXT,
    notes TEXT,
    test_number INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. СОЗДАНИЕ ФУНКЦИЙ
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    WHERE u.id = _user_id
      AND u.email = 'dishka.da@yandex.ru'
      AND ur.role = 'admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.email = 'dishka.da@yandex.ru' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_participant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.участники (user_id, name, last_name, points)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'Новый участник'),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    0
  );
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(p_ip_address inet)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 4. СОЗДАНИЕ ТРИГГЕРОВ
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TRIGGER on_auth_user_participant_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_participant();

CREATE TRIGGER update_intensive_streams_updated_at
  BEFORE UPDATE ON public.intensive_streams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cooper_test_results_updated_at
  BEFORE UPDATE ON public.cooper_test_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. ВКЛЮЧЕНИЕ RLS
ALTER TABLE public.achievement_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_rate_limit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intensive_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.участники ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.кэмп_активности ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.аскезы_участников ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.тотемы_участников ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooper_test_results ENABLE ROW LEVEL SECURITY;

-- 6. СОЗДАНИЕ ПОЛИТИК RLS

-- achievement_types
CREATE POLICY "Allow public read access for achievement_types"
ON public.achievement_types FOR SELECT USING (true);

-- activities
CREATE POLICY "Allow public read access for activities"
ON public.activities FOR SELECT USING (true);

-- admin_access_log
CREATE POLICY "Only super admin can access logs"
ON public.admin_access_log FOR SELECT USING (is_super_admin(auth.uid()));

-- contact_rate_limit
CREATE POLICY "Public can insert rate limit entries"
ON public.contact_rate_limit FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update rate limit entries"
ON public.contact_rate_limit FOR UPDATE USING (true);

-- contact_submissions
CREATE POLICY "Only admins can read contact submissions"
ON public.contact_submissions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Validated public contact inserts"
ON public.contact_submissions FOR INSERT WITH CHECK (
  length(TRIM(BOTH FROM name)) >= 2 AND
  length(TRIM(BOTH FROM phone)) >= 10 AND
  length(TRIM(BOTH FROM course)) > 0 AND
  check_contact_rate_limit(COALESCE((current_setting('request.headers', true)::json ->> 'x-forwarded-for')::inet, inet_client_addr()))
);

-- intensive_streams
CREATE POLICY "Allow public read access for active streams"
ON public.intensive_streams FOR SELECT USING (is_active = true);

CREATE POLICY "Super admin can manage all streams"
ON public.intensive_streams FOR ALL USING (is_super_admin(auth.uid())) WITH CHECK (is_super_admin(auth.uid()));

-- участники
CREATE POLICY "Super admin can manage all participants"
ON public.участники FOR ALL USING (is_super_admin(auth.uid())) WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Users can view their own participant"
ON public.участники FOR SELECT USING (auth.uid() = user_id AND NOT is_super_admin(auth.uid()));

CREATE POLICY "Users can create their own participant"
ON public.участники FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT is_super_admin(auth.uid()));

CREATE POLICY "Users can update their own participant"
ON public.участники FOR UPDATE USING (auth.uid() = user_id AND NOT is_super_admin(auth.uid())) WITH CHECK (auth.uid() = user_id AND NOT is_super_admin(auth.uid()));

-- user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- кэмп_активности
CREATE POLICY "Super admin can manage all kamp activities"
ON public.кэмп_активности FOR ALL USING (is_super_admin(auth.uid())) WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Users can view their own kamp activities"
ON public.кэмп_активности FOR SELECT USING (
  participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid()) AND NOT is_super_admin(auth.uid())
);

-- аскезы_участников
CREATE POLICY "Users can manage their own ascetics"
ON public.аскезы_участников FOR ALL USING (
  participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid())
) WITH CHECK (
  participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid())
);

-- тотемы_участников
CREATE POLICY "Users can view their own totems"
ON public.тотемы_участников FOR SELECT USING (
  participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid())
);

-- cooper_test_results
CREATE POLICY "Super admin can manage all Cooper test results"
ON public.cooper_test_results FOR ALL USING (is_super_admin(auth.uid()));

CREATE POLICY "Users can view their own Cooper test results"
ON public.cooper_test_results FOR SELECT USING (
  participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own Cooper test results"
ON public.cooper_test_results FOR INSERT WITH CHECK (
  participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update their own Cooper test results"
ON public.cooper_test_results FOR UPDATE USING (
  participant_id IN (SELECT id FROM участники WHERE user_id = auth.uid())
);

-- 7. ВСТАВКА ДАННЫХ

-- intensive_streams
INSERT INTO public.intensive_streams (id, name, description, start_date, end_date, is_active, is_current, created_at, updated_at) VALUES
('0dbb5d5b-58fe-480d-92ab-01c5f4fa8659', '1-й поток', 'Первый интенсив КЭМП', '2024-01-01', '2024-02-29', true, false, '2025-09-09 14:55:37.837989+00', '2025-09-09 14:55:37.837989+00'),
('6eb0e481-cc25-4b46-bef5-818c3abe05d4', '2-й поток', 'Второй интенсив КЭМП', '2025-09-08', '2025-11-08', true, true, '2025-09-09 14:55:37.837989+00', '2025-09-09 16:30:16.078971+00');

-- user_roles
INSERT INTO public.user_roles (id, user_id, role, created_at) VALUES
('b7e48475-f233-4071-af90-a32e5d99b4dd', 'bd1510ae-55ad-410c-9757-da0632a453bb', 'admin', '2025-09-09 16:00:32.813441+00'),
('c79dc3e1-7892-452f-908f-361f4f7d0f2c', '24bfaea2-147c-428a-b9f0-33978d36f40b', 'user', '2025-09-12 07:36:20.547979+00');

-- участники
INSERT INTO public.участники (id, user_id, name, last_name, email, birth_date, height_cm, weight_kg, points, stream_id, created_at) VALUES
('1f54cf6e-6b32-4dce-b016-aa1ed355e456', 'bd1510ae-55ad-410c-9757-da0632a453bb', 'Димон', '', NULL, NULL, NULL, NULL, 0, NULL, '2025-09-11 16:43:13.567685+00'),
('d3cabd59-298d-4e3b-b1e7-e67f46b8072f', '24bfaea2-147c-428a-b9f0-33978d36f40b', 'Нияз ', '', NULL, NULL, NULL, NULL, 0, NULL, '2025-09-12 07:36:20.547979+00'),
('d7296f9f-fe1f-4434-b261-1caa4b9d55c1', '24bfaea2-147c-428a-b9f0-33978d36f40b', 'Нияз ', 'Гараев', 'Garaev2195@mail.ru', NULL, NULL, NULL, 0, '6eb0e481-cc25-4b46-bef5-818c3abe05d4', '2025-09-12 07:36:20.855475+00');

-- кэмп_активности
INSERT INTO public.кэмп_активности (id, participant_id, activity_type_new, reward_type, zakal_subtype, shram_subtype, training_subtype, lecture_subtype, points, auto_points, multiplier, activity_date, description, verified_by, attendance_counted, created_at) VALUES
('734a88d0-b13b-4eda-9d0d-345e5665153a', 'd7296f9f-fe1f-4434-b261-1caa4b9d55c1', NULL, 'zakal', 'bjj', NULL, NULL, NULL, 1, 1, 1.0, '2025-09-08', NULL, NULL, true, '2025-09-12 07:40:58.12488+00'),
('2b195209-aefe-443c-a4f9-93c434843139', 'd7296f9f-fe1f-4434-b261-1caa4b9d55c1', NULL, 'zakal', 'ofp', NULL, NULL, NULL, 1, 1, 1.0, '2025-09-10', NULL, NULL, true, '2025-09-12 07:41:15.271517+00');

-- contact_submissions
INSERT INTO public.contact_submissions (id, name, phone, course, social, created_at) VALUES
('217efa48-cc99-4cd0-aed3-da9101bcd9ee', 'Сирожидин ', '+79965932210', 'male', NULL, '2025-05-03 05:40:52.180067+00'),
('79dc5b0d-55e0-4fb0-a927-e99fd5ea28a7', 'Азат ', '+79377789786', 'male', '@minullin1985', '2025-06-23 17:01:06.707602+00'),
('6d598aff-458c-4e80-9891-8557659abd95', 'Андрей ', '+79199015455', 'male', '@andrey_murashv', '2025-06-23 21:02:27.933617+00'),
('30aa44d4-394d-4832-92ea-fc776be2ca1c', 'Валеев Марат ', '+79178828241', 'male', 't.me/doctorvaleev', '2025-06-24 15:08:18.543607+00'),
('c6b5b410-bfdc-434b-a2bc-83a4dca13fdc', 'Артур Атаков', '9625714273', 'male', '@A_r_tyr87', '2025-07-07 17:34:47.56138+00'),
('4c58ecd0-a40e-4079-a6a5-59c33de96b3a', 'Марат', '9375228169', 'male', '', '2025-07-08 13:56:15.305625+00'),
('fcd127d6-f3d5-49d2-8d3c-7c1800b05848', 'Антон ', '+7 905 182 27 01', 'male', '', '2025-07-09 09:27:43.477827+00'),
('c99e871e-b749-4ac7-b586-c903326c1b01', 'Ильшат', '+79600800823', 'male', 'Телеграмм', '2025-07-18 14:07:47.803236+00'),
('0046d7de-f0b5-44be-a0e8-0cd66b56ffa7', 'Рустем', '+79272495012', 'male', 'Тг rystem', '2025-08-04 15:42:15.651807+00');

-- ГОТОВО! Выполните этот скрипт в SQL Editor нового проекта.