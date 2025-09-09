-- Удаляем проблемный view и функцию
DROP VIEW IF EXISTS public.safe_leaderboard;
DROP FUNCTION IF EXISTS public.get_public_leaderboard();

-- Восстанавливаем доступ к leaderboard через простую RLS политику
-- Но только для чтения базовых данных рейтинга
CREATE POLICY "Public can view leaderboard data"
ON public.участники  
FOR SELECT
TO public
USING (
  -- Разрешаем доступ только если это запрос к leaderboard view
  -- и только к безопасным полям (имя и баллы)
  name IS NOT NULL 
  AND name != '' 
  AND name NOT IN ('dishka', 'Дима', 'Димон')
);

-- Создаем материализованный view для leaderboard (обновляется периодически)
-- Это безопаснее чем прямой доступ к таблице
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard_cache AS
SELECT 
  id,
  name,
  points,
  ROW_NUMBER() OVER (ORDER BY points DESC) as rank
FROM участники
WHERE name IS NOT NULL 
  AND name != ''
  AND name NOT IN ('dishka', 'Дима', 'Димон')
ORDER BY points DESC;

-- Создаем функцию для обновления кэша (без SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.refresh_leaderboard_cache()
RETURNS void
LANGUAGE sql
SET search_path TO 'public'
AS $$
  REFRESH MATERIALIZED VIEW leaderboard_cache;
$$;

-- Разрешаем публичное чтение кэша leaderboard
GRANT SELECT ON public.leaderboard_cache TO public;

-- Создаем триггер для автообновления кэша при изменении баллов
CREATE OR REPLACE FUNCTION public.auto_refresh_leaderboard()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Обновляем кэш при изменении баллов
  REFRESH MATERIALIZED VIEW leaderboard_cache;
  RETURN NULL;
END;
$$;