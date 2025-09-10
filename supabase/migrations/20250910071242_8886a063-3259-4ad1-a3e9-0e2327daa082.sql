-- Проверяем и исправляем политики для contact_submissions
DROP POLICY IF EXISTS "Secure public contact form inserts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow public inserts for contact forms" ON public.contact_submissions;

-- Создаем улучшенную политику для contact_submissions с валидацией
CREATE POLICY "Validated public contact inserts"
ON public.contact_submissions
FOR INSERT
WITH CHECK (
  -- Валидируем обязательные поля и применяем rate limiting
  length(trim(name)) >= 2 
  AND length(trim(phone)) >= 10 
  AND length(trim(course)) > 0
  AND check_contact_rate_limit(
    COALESCE(
      (current_setting('request.headers', true)::json->>'x-forwarded-for')::inet,
      inet_client_addr()
    )
  )
);

-- Проверяем и исправляем политики для service_bookings  
DROP POLICY IF EXISTS "Secure public service booking inserts" ON public.service_bookings;
DROP POLICY IF EXISTS "Allow public inserts for service bookings" ON public.service_bookings;

-- Создаем улучшенную политику для service_bookings с валидацией
CREATE POLICY "Validated public service booking inserts"
ON public.service_bookings  
FOR INSERT
WITH CHECK (
  -- Валидируем все обязательные поля
  length(trim(name)) >= 2
  AND length(trim(phone)) >= 10
  AND length(trim(package_id)) > 0
  AND length(trim(package_title)) > 0
  AND package_price > 0
);