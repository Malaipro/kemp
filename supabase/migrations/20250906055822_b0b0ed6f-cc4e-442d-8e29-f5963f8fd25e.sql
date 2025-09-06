-- Добавляем поле фамилии в таблицу участников
ALTER TABLE public."участники" ADD COLUMN last_name TEXT;

-- Создаем enum для ролей
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Создаем таблицу ролей пользователей
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Включаем RLS для таблицы ролей
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Создаем функцию для проверки ролей
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Создаем функцию для проверки супер админа
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
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

-- Политики для user_roles
CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Обновляем политики участников - супер админ видит всех
DROP POLICY IF EXISTS "Allow authenticated users to read participants" ON public."участники";
DROP POLICY IF EXISTS "Allow users to create their own participant" ON public."участники";
DROP POLICY IF EXISTS "Allow users to update their own participant" ON public."участники";

CREATE POLICY "Super admin can view all participants" 
ON public."участники" 
FOR SELECT 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can view their own participant" 
ON public."участники" 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Super admin can manage all participants" 
ON public."участники" 
FOR ALL 
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can create their own participant" 
ON public."участники" 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participant" 
ON public."участники" 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Обновляем политики КЭМП активностей
DROP POLICY IF EXISTS "Users can view their own kamp activities" ON public."кэмп_активности";
DROP POLICY IF EXISTS "Trainers can insert kamp activities" ON public."кэмп_активности";

CREATE POLICY "Super admin can view all kamp activities" 
ON public."кэмп_активности" 
FOR SELECT 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can view their own kamp activities" 
ON public."кэмп_активности" 
FOR SELECT 
USING (participant_id IN (
    SELECT id FROM public."участники" WHERE user_id = auth.uid()
));

CREATE POLICY "Super admin can manage all kamp activities" 
ON public."кэмп_активности" 
FOR ALL 
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- Обновляем политики тотемов участников
DROP POLICY IF EXISTS "Users can view their own totems" ON public."тотемы_участников";

CREATE POLICY "Super admin can view all totems" 
ON public."тотемы_участников" 
FOR SELECT 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can view their own totems" 
ON public."тотемы_участников" 
FOR SELECT 
USING (participant_id IN (
    SELECT id FROM public."участники" WHERE user_id = auth.uid()
));

-- Обновляем политики аскез
DROP POLICY IF EXISTS "Users can manage their own ascetics" ON public."аскезы_участников";

CREATE POLICY "Super admin can view all ascetics" 
ON public."аскезы_участников" 
FOR SELECT 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can manage their own ascetics" 
ON public."аскезы_участников" 
FOR ALL 
USING (participant_id IN (
    SELECT id FROM public."участники" WHERE user_id = auth.uid()
))
WITH CHECK (participant_id IN (
    SELECT id FROM public."участники" WHERE user_id = auth.uid()
));

CREATE POLICY "Super admin can manage all ascetics" 
ON public."аскезы_участников" 
FOR ALL 
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- Обновляем политики прогресса аскез
DROP POLICY IF EXISTS "Users can manage their own ascetic progress" ON public."прогресс_аскез";

CREATE POLICY "Super admin can view all ascetic progress" 
ON public."прогресс_аскез" 
FOR SELECT 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can manage their own ascetic progress" 
ON public."прогресс_аскез" 
FOR ALL 
USING (ascetic_id IN (
    SELECT a.id FROM public."аскезы_участников" a
    JOIN public."участники" p ON a.participant_id = p.id
    WHERE p.user_id = auth.uid()
))
WITH CHECK (ascetic_id IN (
    SELECT a.id FROM public."аскезы_участников" a
    JOIN public."участники" p ON a.participant_id = p.id
    WHERE p.user_id = auth.uid()
));

CREATE POLICY "Super admin can manage all ascetic progress" 
ON public."прогресс_аскез" 
FOR ALL 
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- Создаем функцию для автоматического назначения роли пользователя
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Создаем триггер для автоматического назначения ролей
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();