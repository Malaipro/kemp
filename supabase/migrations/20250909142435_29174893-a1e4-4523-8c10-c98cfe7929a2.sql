-- Создаем записи участников для существующих пользователей, у которых их нет
INSERT INTO public.участники (user_id, name, last_name, points)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'name', 'Участник') as name,
  COALESCE(u.raw_user_meta_data->>'lastName', '') as last_name,
  0 as points
FROM auth.users u
LEFT JOIN public.участники p ON u.id = p.user_id
WHERE p.user_id IS NULL;