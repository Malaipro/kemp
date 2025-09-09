-- Удаляем небезопасный view с SECURITY DEFINER
DROP VIEW IF EXISTS public.contact_submissions_secure;

-- Создаем обычный view без SECURITY DEFINER
CREATE VIEW public.contact_submissions_secure AS
SELECT 
  id,
  name,
  -- Маскируем телефон для дополнительной безопасности
  CASE 
    WHEN is_super_admin(auth.uid()) THEN phone
    ELSE CONCAT(LEFT(phone, 3), '***', RIGHT(phone, 2))
  END as phone,
  social,
  course,
  created_at
FROM public.contact_submissions;

-- Добавляем RLS политику для нового view
ALTER VIEW public.contact_submissions_secure SET (security_barrier = true);

-- Создаем RLS политику для view
CREATE POLICY "Only admins can access secure contact view"
ON public.contact_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Также исправляем функцию, добавляя SET search_path
CREATE OR REPLACE FUNCTION public.log_admin_access(
  p_table_name TEXT,
  p_action TEXT
) 
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Логируем только если пользователь является админом
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    INSERT INTO public.admin_access_log (
      admin_user_id,
      table_name,
      action,
      accessed_at
    ) VALUES (
      auth.uid(),
      p_table_name,
      p_action,
      NOW()
    );
  END IF;
END;
$$;

-- Исправляем функцию get_contact_submissions_with_audit
CREATE OR REPLACE FUNCTION public.get_contact_submissions_with_audit()
RETURNS SETOF public.contact_submissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Логируем доступ
  PERFORM log_admin_access('contact_submissions', 'SELECT');
  
  -- Возвращаем данные только если пользователь админ
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN QUERY 
    SELECT * FROM public.contact_submissions
    ORDER BY created_at DESC;
  END IF;
END;
$$;

-- Исправляем функцию check_contact_rate_limit
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(p_ip_address INET)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $$
DECLARE
  current_count INTEGER := 0;
  time_window INTERVAL := '1 hour';
  max_submissions INTEGER := 5; -- Максимум 5 отправок в час
BEGIN
  -- Получаем количество отправок за последний час
  SELECT COALESCE(SUM(submission_count), 0)
  INTO current_count
  FROM public.contact_rate_limit
  WHERE ip_address = p_ip_address
    AND window_start > (NOW() - time_window);
  
  -- Если превышено ограничение, возвращаем false
  IF current_count >= max_submissions THEN
    RETURN FALSE;
  END IF;
  
  -- Иначе обновляем или создаем запись
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