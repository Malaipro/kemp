-- Добавляем поле фамилии в таблицу участников (если не существует)
ALTER TABLE public."участники" ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Создаем таблицу ролей пользователей (если не существует)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Включаем RLS для таблицы ролей
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

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
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Обновляем политики участников
DROP POLICY IF EXISTS "Allow authenticated users to read participants" ON public."участники";
DROP POLICY IF EXISTS "Allow users to create their own participant" ON public."участники";
DROP POLICY IF EXISTS "Allow users to update their own participant" ON public."участники";
DROP POLICY IF EXISTS "Super admin can view all participants" ON public."участники";
DROP POLICY IF EXISTS "Users can view their own participant" ON public."участники";
DROP POLICY IF EXISTS "Super admin can manage all participants" ON public."участники";

CREATE POLICY "Super admin can view all participants" 
ON public."участники" 
FOR SELECT 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can view their own participant" 
ON public."участники" 
FOR SELECT 
USING (auth.uid() = user_id AND NOT public.is_super_admin(auth.uid()));

CREATE POLICY "Super admin can manage all participants" 
ON public."участники" 
FOR ALL 
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can create their own participant" 
ON public."участники" 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND NOT public.is_super_admin(auth.uid()));

CREATE POLICY "Users can update their own participant" 
ON public."участники" 
FOR UPDATE 
USING (auth.uid() = user_id AND NOT public.is_super_admin(auth.uid()))
WITH CHECK (auth.uid() = user_id AND NOT public.is_super_admin(auth.uid()));

-- Обновляем политики КЭМП активностей
DROP POLICY IF EXISTS "Users can view their own kamp activities" ON public."кэмп_активности";
DROP POLICY IF EXISTS "Trainers can insert kamp activities" ON public."кэмп_активности";
DROP POLICY IF EXISTS "Super admin can view all kamp activities" ON public."кэмп_активности";
DROP POLICY IF EXISTS "Super admin can manage all kamp activities" ON public."кэмп_активности";

CREATE POLICY "Super admin can manage all kamp activities" 
ON public."кэмп_активности" 
FOR ALL 
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can view their own kamp activities" 
ON public."кэмп_активности" 
FOR SELECT 
USING (participant_id IN (
    SELECT id FROM public."участники" WHERE user_id = auth.uid()
) AND NOT public.is_super_admin(auth.uid()));

-- Функция для автоматического назначения ролей
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

-- Создаем триггер
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();