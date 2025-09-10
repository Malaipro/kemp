-- Добавляем более строгие политики для contact_submissions
DROP POLICY IF EXISTS "Allow public inserts for contact forms" ON public.contact_submissions;

-- Создаем более безопасную политику для вставок с rate limiting
CREATE POLICY "Secure public contact form inserts"
ON public.contact_submissions
FOR INSERT
WITH CHECK (
  -- Проверяем rate limit и валидируем данные
  check_contact_rate_limit(
    COALESCE(
      (current_setting('request.headers', true)::json->>'x-forwarded-for')::inet,
      inet_client_addr()
    )
  )
  AND length(name) > 0 
  AND length(phone) > 0
);

-- Добавляем более строгие политики для service_bookings
DROP POLICY IF EXISTS "Allow public inserts for service bookings" ON public.service_bookings;

-- Создаем более безопасную политику для service bookings
CREATE POLICY "Secure public service booking inserts"
ON public.service_bookings
FOR INSERT
WITH CHECK (
  -- Валидируем обязательные поля
  length(name) > 0 
  AND length(phone) > 0 
  AND length(package_id) > 0
  AND length(package_title) > 0
  AND package_price > 0
);

-- Добавляем trigger для автоматического логирования подозрительной активности
CREATE OR REPLACE FUNCTION log_suspicious_contact_activity()
RETURNS TRIGGER AS $$
DECLARE
  client_ip inet;
  user_agent text;
BEGIN
  -- Получаем IP и User-Agent
  client_ip := COALESCE(
    (current_setting('request.headers', true)::json->>'x-forwarded-for')::inet,
    inet_client_addr()
  );
  
  user_agent := current_setting('request.headers', true)::json->>'user-agent';
  
  -- Логируем в админский лог
  INSERT INTO admin_access_log (
    admin_user_id,
    table_name,
    action,
    ip_address,
    user_agent,
    accessed_at
  ) VALUES (
    NULL, -- Публичный доступ
    TG_TABLE_NAME,
    'PUBLIC_INSERT',
    client_ip,
    user_agent,
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Применяем trigger к обеим таблицам
CREATE TRIGGER log_contact_submissions_activity
  AFTER INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION log_suspicious_contact_activity();

CREATE TRIGGER log_service_bookings_activity
  AFTER INSERT ON public.service_bookings  
  FOR EACH ROW EXECUTE FUNCTION log_suspicious_contact_activity();