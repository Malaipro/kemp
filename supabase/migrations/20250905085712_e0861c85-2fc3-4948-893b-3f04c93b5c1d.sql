-- Переименовываем таблицы на русский язык

-- Переименовываем participants в участники
ALTER TABLE participants RENAME TO участники;

-- Переименовываем kamp_activities в кэмп_активности 
ALTER TABLE kamp_activities RENAME TO кэмп_активности;

-- Переименовываем participant_totems в тотемы_участников
ALTER TABLE participant_totems RENAME TO тотемы_участников;

-- Переименовываем totem_requirements в требования_тотемов
ALTER TABLE totem_requirements RENAME TO требования_тотемов;

-- Переименовываем participant_ascetics в аскезы_участников
ALTER TABLE participant_ascetics RENAME TO аскезы_участников;

-- Переименовываем ascetic_progress в прогресс_аскез
ALTER TABLE ascetic_progress RENAME TO прогресс_аскез;

-- Обновляем функцию calculate_participant_progress для новых названий таблиц
CREATE OR REPLACE FUNCTION public.calculate_participant_progress(p_participant_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  result JSONB := '{}';
  zakal_bjj_count INTEGER := 0;
  zakal_kick_count INTEGER := 0;
  zakal_ofp_count INTEGER := 0;
  gran_count INTEGER := 0;
  shram_bjj_count INTEGER := 0;
  shram_kick_count INTEGER := 0;
  shram_ofp_count INTEGER := 0;
  shram_tactics_count INTEGER := 0;
  total_points INTEGER := 0;
BEGIN
  -- Подсчитываем закалы
  SELECT COUNT(*) INTO zakal_bjj_count 
  FROM кэмп_активности
  WHERE participant_id = p_participant_id AND reward_type = 'zakal' AND zakal_subtype = 'bjj';
  
  SELECT COUNT(*) INTO zakal_kick_count 
  FROM кэмп_активности
  WHERE participant_id = p_participant_id AND reward_type = 'zakal' AND zakal_subtype = 'kick';
  
  SELECT COUNT(*) INTO zakal_ofp_count 
  FROM кэмп_активности
  WHERE participant_id = p_participant_id AND reward_type = 'zakal' AND zakal_subtype = 'ofp';
  
  -- Подсчитываем грани
  SELECT COUNT(*) INTO gran_count 
  FROM кэмп_активности
  WHERE participant_id = p_participant_id AND reward_type = 'gran';
  
  -- Подсчитываем шрамы
  SELECT COUNT(*) INTO shram_bjj_count 
  FROM кэмп_активности
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'bjj';
  
  SELECT COUNT(*) INTO shram_kick_count 
  FROM кэмп_активности
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'kick';
  
  SELECT COUNT(*) INTO shram_ofp_count 
  FROM кэмп_активности
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'ofp';
  
  SELECT COUNT(*) INTO shram_tactics_count 
  FROM кэмп_активности
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'tactics';
  
  -- Подсчитываем общие баллы
  SELECT COALESCE(SUM(points * multiplier), 0)::INTEGER INTO total_points 
  FROM кэмп_активности
  WHERE participant_id = p_participant_id;
  
  result := jsonb_build_object(
    'zakal_bjj', zakal_bjj_count,
    'zakal_kick', zakal_kick_count,
    'zakal_ofp', zakal_ofp_count,
    'gran', gran_count,
    'shram_bjj', shram_bjj_count,
    'shram_kick', shram_kick_count,
    'shram_ofp', shram_ofp_count,
    'shram_tactics', shram_tactics_count,
    'total_points', total_points
  );
  
  RETURN result;
END;
$function$;

-- Создаем функцию автоматической проверки и присуждения тотемов
CREATE OR REPLACE FUNCTION public.check_and_award_totems(p_participant_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  progress_data JSONB;
  awarded_totems TEXT[] := '{}';
  totem_record RECORD;
BEGIN
  -- Получаем текущий прогресс участника
  SELECT calculate_participant_progress(p_participant_id) INTO progress_data;
  
  -- Проверяем тотем "Змей" (БЖЖ)
  IF (progress_data->>'zakal_bjj')::INTEGER >= 8 AND (progress_data->>'shram_bjj')::INTEGER >= 1 THEN
    -- Проверяем, что тотем еще не получен
    IF NOT EXISTS (SELECT 1 FROM тотемы_участников WHERE participant_id = p_participant_id AND totem_type = 'snake') THEN
      INSERT INTO тотемы_участников (participant_id, totem_type, requirements_met)
      VALUES (p_participant_id, 'snake', jsonb_build_object('zakal_bjj', (progress_data->>'zakal_bjj')::INTEGER, 'shram_bjj', (progress_data->>'shram_bjj')::INTEGER));
      awarded_totems := array_append(awarded_totems, 'snake');
    END IF;
  END IF;
  
  -- Проверяем тотем "Лапа" (Кикбоксинг)
  IF (progress_data->>'zakal_kick')::INTEGER >= 8 AND (progress_data->>'shram_kick')::INTEGER >= 1 THEN
    IF NOT EXISTS (SELECT 1 FROM тотемы_участников WHERE participant_id = p_participant_id AND totem_type = 'paw') THEN
      INSERT INTO тотемы_участников (participant_id, totem_type, requirements_met)
      VALUES (p_participant_id, 'paw', jsonb_build_object('zakal_kick', (progress_data->>'zakal_kick')::INTEGER, 'shram_kick', (progress_data->>'shram_kick')::INTEGER));
      awarded_totems := array_append(awarded_totems, 'paw');
    END IF;
  END IF;
  
  -- Проверяем тотем "Молот" (ОФП)
  IF (progress_data->>'zakal_ofp')::INTEGER >= 8 AND (progress_data->>'shram_ofp')::INTEGER >= 1 THEN
    IF NOT EXISTS (SELECT 1 FROM тотемы_участников WHERE participant_id = p_participant_id AND totem_type = 'hammer') THEN
      INSERT INTO тотемы_участников (participant_id, totem_type, requirements_met)
      VALUES (p_participant_id, 'hammer', jsonb_build_object('zakal_ofp', (progress_data->>'zakal_ofp')::INTEGER, 'shram_ofp', (progress_data->>'shram_ofp')::INTEGER));
      awarded_totems := array_append(awarded_totems, 'hammer');
    END IF;
  END IF;
  
  -- Проверяем тотем "Клинок" (все три шрама)
  IF (progress_data->>'shram_bjj')::INTEGER >= 1 AND (progress_data->>'shram_kick')::INTEGER >= 1 AND (progress_data->>'shram_ofp')::INTEGER >= 1 THEN
    IF NOT EXISTS (SELECT 1 FROM тотемы_участников WHERE participant_id = p_participant_id AND totem_type = 'blade') THEN
      INSERT INTO тотемы_участников (participant_id, totem_type, requirements_met)
      VALUES (p_participant_id, 'blade', jsonb_build_object('shram_bjj', (progress_data->>'shram_bjj')::INTEGER, 'shram_kick', (progress_data->>'shram_kick')::INTEGER, 'shram_ofp', (progress_data->>'shram_ofp')::INTEGER));
      awarded_totems := array_append(awarded_totems, 'blade');
    END IF;
  END IF;
  
  RETURN jsonb_build_object('awarded_totems', awarded_totems, 'progress', progress_data);
END;
$function$;

-- Создаем триггер для автоматической проверки тотемов при добавлении активности
CREATE OR REPLACE FUNCTION public.auto_check_totems_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  result JSONB;
BEGIN
  -- Автоматически проверяем и присуждаем тотемы после добавления новой активности
  SELECT check_and_award_totems(NEW.participant_id) INTO result;
  
  RETURN NEW;
END;
$function$;

-- Создаем триггер на таблицу кэмп_активности
DROP TRIGGER IF EXISTS trigger_auto_check_totems ON кэмп_активности;
CREATE TRIGGER trigger_auto_check_totems
    AFTER INSERT ON кэмп_активности
    FOR EACH ROW
    EXECUTE FUNCTION auto_check_totems_trigger();