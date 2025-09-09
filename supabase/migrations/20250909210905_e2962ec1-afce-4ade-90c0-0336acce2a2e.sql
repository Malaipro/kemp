-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Удаляем опасную публичную политику
DROP POLICY IF EXISTS "Public can view leaderboard" ON public.участники;

-- Таблица leaderboard должна быть VIEW, давайте убедимся что RLS настроен правильно
-- Для leaderboard view нужно обеспечить публичный доступ без компрометации основных данных

-- Создаем безопасную политику только для authenticated пользователей для leaderboard
-- (это будет работать с leaderboard view)
CREATE POLICY "Public can view participant rankings"
ON public.участники
FOR SELECT
TO public
USING (
  -- Разрешаем чтение только основных полей для рейтинга (имя и баллы)
  -- но не личных данных
  true
);

-- Немедленно ограничиваем эту политику - удаляем ее и создаем более безопасную
DROP POLICY IF EXISTS "Public can view participant rankings" ON public.участники;

-- Leaderboard это VIEW, поэтому нужно создать отдельную RLS политику
-- Но сначала нужно убедиться что основная таблица участники защищена

-- Создаем функцию для безопасного доступа к leaderboard
CREATE OR REPLACE FUNCTION public.get_public_leaderboard()
RETURNS TABLE(
  id UUID,
  name TEXT,
  points INTEGER,
  rank BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.points,
    ROW_NUMBER() OVER (ORDER BY p.points DESC) as rank
  FROM участники p
  WHERE p.name IS NOT NULL 
    AND p.name != ''
    AND p.name NOT IN ('dishka', 'Дима', 'Димон')
  ORDER BY p.points DESC;
END;
$$;

-- Создаем безопасный view для leaderboard
CREATE OR REPLACE VIEW public.safe_leaderboard AS
SELECT * FROM get_public_leaderboard();

-- Разрешаем публичный доступ к безопасному view
GRANT SELECT ON public.safe_leaderboard TO public;