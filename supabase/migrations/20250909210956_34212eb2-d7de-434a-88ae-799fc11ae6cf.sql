-- Удаляем материализованный view (он вызывает предупреждения)
DROP MATERIALIZED VIEW IF EXISTS public.leaderboard_cache;
DROP FUNCTION IF EXISTS public.refresh_leaderboard_cache();
DROP FUNCTION IF EXISTS public.auto_refresh_leaderboard();

-- Удаляем проблемную политику публичного доступа к участники
DROP POLICY IF EXISTS "Public can view leaderboard data" ON public.участники;

-- Поскольку leaderboard это уже существующий VIEW, давайте проверим как он работает
-- и убедимся что RLS настроен правильно для базовых таблиц

-- Leaderboard view должен работать через существующие RLS политики
-- Давайте убедимся что участники защищены, но leaderboard доступен

-- Если нужен публичный доступ к leaderboard, создадим простую политику
-- только для чтения рейтингов (имя и баллы) без личных данных
CREATE POLICY "Leaderboard public access"
ON public.участники
FOR SELECT 
TO public
USING (
  -- Разрешаем только чтение для leaderboard
  -- Это ограничивает доступ к минимальным данным
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'leaderboard'
  )
);

-- Но это тоже может быть проблематично, давайте удалим и эту политику
DROP POLICY IF EXISTS "Leaderboard public access" ON public.участники;

-- Вместо этого, давайте использовать подход через функцию без SECURITY DEFINER
-- но с правильными разрешениями

-- Создаем простую функцию для получения leaderboard данных
CREATE OR REPLACE FUNCTION public.get_leaderboard_data()
RETURNS TABLE(
  id UUID,
  name TEXT, 
  points INTEGER,
  rank BIGINT
)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT 
    p.id,
    p.name,
    p.points,
    ROW_NUMBER() OVER (ORDER BY p.points DESC) as rank
  FROM участники p
  WHERE p.name IS NOT NULL 
    AND p.name != ''
    AND p.name NOT IN ('dishka', 'Дима', 'Димон')
    AND has_role(auth.uid(), 'admin'::app_role)  -- Только для админов
  ORDER BY p.points DESC;
$$;

-- Разрешаем выполнение функции всем пользователям 
GRANT EXECUTE ON FUNCTION public.get_leaderboard_data() TO public;