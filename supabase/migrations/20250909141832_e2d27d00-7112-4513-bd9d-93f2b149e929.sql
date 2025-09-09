-- Создаем триггер для автоматического создания профиля участника при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user_participant()
RETURNS TRIGGER AS $$
BEGIN
  -- Создаем запись участника для нового пользователя
  INSERT INTO public.участники (user_id, name, last_name, points)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'Новый участник'),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    0
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Создаем триггер который будет вызываться при создании нового пользователя
DROP TRIGGER IF EXISTS on_auth_user_created_participant ON auth.users;
CREATE TRIGGER on_auth_user_created_participant
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_participant();