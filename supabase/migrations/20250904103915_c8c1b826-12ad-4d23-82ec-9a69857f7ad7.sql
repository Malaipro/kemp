-- Исправляем функцию calculate_participant_progress, добавляя правильный search_path
CREATE OR REPLACE FUNCTION public.calculate_participant_progress(p_participant_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  FROM kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'zakal' AND zakal_subtype = 'bjj';
  
  SELECT COUNT(*) INTO zakal_kick_count 
  FROM kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'zakal' AND zakal_subtype = 'kick';
  
  SELECT COUNT(*) INTO zakal_ofp_count 
  FROM kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'zakal' AND zakal_subtype = 'ofp';
  
  -- Подсчитываем грани
  SELECT COUNT(*) INTO gran_count 
  FROM kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'gran';
  
  -- Подсчитываем шрамы
  SELECT COUNT(*) INTO shram_bjj_count 
  FROM kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'bjj';
  
  SELECT COUNT(*) INTO shram_kick_count 
  FROM kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'kick';
  
  SELECT COUNT(*) INTO shram_ofp_count 
  FROM kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'ofp';
  
  SELECT COUNT(*) INTO shram_tactics_count 
  FROM kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'tactics';
  
  -- Подсчитываем общие баллы
  SELECT COALESCE(SUM(points * multiplier), 0)::INTEGER INTO total_points 
  FROM kamp_activities 
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
$$;