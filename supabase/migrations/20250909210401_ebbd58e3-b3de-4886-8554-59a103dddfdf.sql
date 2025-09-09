-- Удаляем view полностью, так как он может вызывать проблемы безопасности
DROP VIEW IF EXISTS public.contact_submissions_secure;

-- Удаляем дублирующую политику, так как она уже существует
DROP POLICY IF EXISTS "Only admins can access secure contact view" ON public.contact_submissions;

-- Исправляем функцию update_updated_at_column, добавляя search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Проверяем и исправляем другие функции без search_path
CREATE OR REPLACE FUNCTION public.update_direction_progress()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  direction_rec RECORD;
  progress_rec RECORD;
  total_requirements INTEGER;
  completed_count INTEGER;
  new_percentage DECIMAL(5,2);
BEGIN
  -- Get direction info
  SELECT d.*, a.id as activity_direction_id 
  INTO direction_rec 
  FROM public.directions d
  LEFT JOIN public.activities a ON a.id = NEW.activity_id
  WHERE d.id = NEW.direction_id OR 
        (NEW.activity_id IS NOT NULL AND d.name = 
         CASE 
           WHEN a.title LIKE '%БЖЖ%' OR a.title LIKE '%джиу%' THEN 'БЖЖ'
           WHEN a.title LIKE '%кик%' OR a.title LIKE '%бокс%' THEN 'Кикбоксинг'
           WHEN a.title LIKE '%ОФП%' OR a.title LIKE '%физ%' THEN 'ОФП'
           WHEN a.title LIKE '%лекц%' OR a.title LIKE '%КЭМП%' THEN 'Пирамида КЭМП'
           ELSE NULL
         END);

  IF direction_rec.id IS NOT NULL THEN
    -- Get or create progress record
    SELECT * INTO progress_rec 
    FROM public.direction_progress 
    WHERE participant_id = NEW.participant_id AND direction_id = direction_rec.id;
    
    IF progress_rec.id IS NULL THEN
      INSERT INTO public.direction_progress (participant_id, direction_id)
      VALUES (NEW.participant_id, direction_rec.id)
      RETURNING * INTO progress_rec;
    END IF;
    
    -- Calculate progress
    total_requirements := direction_rec.required_activities + direction_rec.required_lectures + 
                         CASE WHEN direction_rec.has_final_test THEN 1 ELSE 0 END;
    
    completed_count := progress_rec.activities_completed + progress_rec.lectures_completed + 
                      CASE WHEN progress_rec.final_test_passed THEN 1 ELSE 0 END;
    
    new_percentage := CASE WHEN total_requirements > 0 
                     THEN (completed_count::DECIMAL / total_requirements::DECIMAL) * 100 
                     ELSE 0 END;
    
    UPDATE public.direction_progress 
    SET progress_percentage = new_percentage,
        updated_at = now()
    WHERE id = progress_rec.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Исправляем функцию calculate_participant_progress
CREATE OR REPLACE FUNCTION public.calculate_participant_progress(p_participant_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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