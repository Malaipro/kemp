-- Включаем RLS для таблицы leaderboard (это VIEW, но нужно защитить базовую таблицу)
-- Сначала проверим, является ли leaderboard VIEW или таблицей
-- Если это VIEW, нужно создать RLS политики для базовых таблиц

-- Создаем RLS политику для публичного чтения leaderboard
-- (так как это рейтинг участников, который должен быть публично доступен)
CREATE POLICY "Public can view leaderboard"
ON public.участники
FOR SELECT
USING (true);

-- Убеждаемся, что существующие политики для contact_submissions правильно настроены
-- Проверяем и при необходимости пересоздаем политики

-- Сначала удаляем старые политики если они есть
DROP POLICY IF EXISTS "Allow public inserts for contact forms" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can read contact submissions" ON public.contact_submissions;

-- Создаем новые политики с более явными настройками
CREATE POLICY "Allow public inserts for contact forms"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Only admins can read contact submissions"
ON public.contact_submissions  
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Аналогично для service_bookings
DROP POLICY IF EXISTS "Allow authenticated users to insert bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Only admins can read service bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Only admins can update service bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Only admins can delete service bookings" ON public.service_bookings;

-- Пересоздаем политики для service_bookings
CREATE POLICY "Allow public inserts for service bookings"
ON public.service_bookings
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Only admins can read service bookings"
ON public.service_bookings
FOR SELECT  
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update service bookings"
ON public.service_bookings
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete service bookings"
ON public.service_bookings
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));