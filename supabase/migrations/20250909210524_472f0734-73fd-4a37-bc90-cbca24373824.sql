-- Исправляем остальные функции, добавляя SET search_path
CREATE OR REPLACE FUNCTION public.check_and_award_totems(p_participant_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.auto_check_totems_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result JSONB;
BEGIN
  -- Автоматически проверяем и присуждаем тотемы после добавления новой активности
  SELECT check_and_award_totems(NEW.participant_id) INTO result;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_activity_points(p_activity_type activity_type_new, p_multiplier numeric DEFAULT 1.0)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  CASE p_activity_type
    WHEN 'training' THEN RETURN (1 * p_multiplier)::integer;
    WHEN 'lecture' THEN RETURN (1 * p_multiplier)::integer;
    WHEN 'homework' THEN RETURN (1 * p_multiplier)::integer;
    WHEN 'crash_test_bjj' THEN RETURN (6 * p_multiplier)::integer;
    WHEN 'crash_test_kick' THEN RETURN (6 * p_multiplier)::integer;
    WHEN 'heroes_race' THEN RETURN (8 * p_multiplier)::integer;
    WHEN 'tactics' THEN RETURN (3 * p_multiplier)::integer;
    WHEN 'ascetic' THEN RETURN 0; -- Аскезы не дают баллы
    ELSE RETURN 1;
  END CASE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_participant_points()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Обновляем баллы участника после добавления активности
  UPDATE public.participants
  SET points = points + (
    SELECT points FROM public.activities WHERE id = NEW.activity_id
  )
  WHERE id = NEW.participant_id;
  
  RETURN NEW;
END;
$function$;