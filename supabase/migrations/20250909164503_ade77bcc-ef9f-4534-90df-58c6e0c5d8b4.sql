-- Обновляем типы активностей согласно новым правилам
-- Удаляем старые типы (если есть)
DROP TYPE IF EXISTS reward_type_new CASCADE;
DROP TYPE IF EXISTS zakal_subtype_new CASCADE; 
DROP TYPE IF EXISTS shram_subtype_new CASCADE;

-- Создаем новые типы активностей
CREATE TYPE activity_type_new AS ENUM (
  'training',        -- Тренировка (+1)
  'lecture',         -- Лекция очно (+1)
  'homework',        -- Домашка к лекции (+1)
  'crash_test_bjj',  -- Краш-тест БЖЖ (+6, Шрам-БЖЖ)
  'crash_test_kick', -- Краш-тест Кик (+6, Шрам-Кик)
  'heroes_race',     -- Гонка героев (+8, Шрам-ОФП)
  'tactics',         -- Тактика (+3, Шрам-Тактика)
  'ascetic'          -- Аскезы (для тотема Монах)
);

-- Создаем подтипы для тренировок
CREATE TYPE training_subtype_new AS ENUM (
  'bjj',    -- БЖЖ (Закал-БЖЖ)
  'kick',   -- Кикбоксинг (Закал-Кик)
  'ofp'     -- ОФП (Закал-ОФП)
);

-- Создаем подтипы для лекций/ДЗ
CREATE TYPE lecture_subtype_new AS ENUM (
  'kemp',        -- Пирамида КЭМП
  'nutrition'    -- Нутрициология
);

-- Обновляем таблицу активностей
ALTER TABLE кэмп_активности 
ADD COLUMN activity_type_new activity_type_new,
ADD COLUMN training_subtype training_subtype_new,
ADD COLUMN lecture_subtype lecture_subtype_new,
ADD COLUMN auto_points integer DEFAULT 1,
ADD COLUMN attendance_counted boolean DEFAULT true;

-- Функция для автоматического расчета баллов
CREATE OR REPLACE FUNCTION calculate_activity_points(
  p_activity_type activity_type_new,
  p_multiplier numeric DEFAULT 1.0
) RETURNS integer AS $$
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
$$ LANGUAGE plpgsql;

-- Обновляем функцию расчета прогресса участника
CREATE OR REPLACE FUNCTION calculate_participant_progress_new(p_participant_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSONB := '{}';
  
  -- Тренировки (Закалы)
  bjj_training_count INTEGER := 0;
  kick_training_count INTEGER := 0;
  ofp_training_count INTEGER := 0;
  
  -- Лекции и ДЗ
  kemp_lectures INTEGER := 0;
  kemp_homework INTEGER := 0;
  nutrition_lectures INTEGER := 0;
  nutrition_homework INTEGER := 0;
  
  -- Шрамы (испытания)
  crash_test_bjj_count INTEGER := 0;
  crash_test_kick_count INTEGER := 0;
  heroes_race_count INTEGER := 0;
  tactics_count INTEGER := 0;
  
  -- Баллы по дисциплинам
  bjj_points INTEGER := 0;
  kick_points INTEGER := 0;
  ofp_points INTEGER := 0;
  kemp_points INTEGER := 0;
  nutrition_points INTEGER := 0;
  tactics_points INTEGER := 0;
  
  total_points INTEGER := 0;
BEGIN
  -- Подсчет тренировок (Закалы)
  SELECT 
    COUNT(*) FILTER (WHERE activity_type_new = 'training' AND training_subtype = 'bjj'),
    COUNT(*) FILTER (WHERE activity_type_new = 'training' AND training_subtype = 'kick'),
    COUNT(*) FILTER (WHERE activity_type_new = 'training' AND training_subtype = 'ofp')
  INTO bjj_training_count, kick_training_count, ofp_training_count
  FROM кэмп_активности
  WHERE participant_id = p_participant_id;
  
  -- Подсчет лекций и ДЗ
  SELECT 
    COUNT(*) FILTER (WHERE activity_type_new = 'lecture' AND lecture_subtype = 'kemp'),
    COUNT(*) FILTER (WHERE activity_type_new = 'homework' AND lecture_subtype = 'kemp'),
    COUNT(*) FILTER (WHERE activity_type_new = 'lecture' AND lecture_subtype = 'nutrition'),
    COUNT(*) FILTER (WHERE activity_type_new = 'homework' AND lecture_subtype = 'nutrition')
  INTO kemp_lectures, kemp_homework, nutrition_lectures, nutrition_homework
  FROM кэмп_активности
  WHERE participant_id = p_participant_id;
  
  -- Подсчет испытаний (Шрамы)
  SELECT 
    COUNT(*) FILTER (WHERE activity_type_new = 'crash_test_bjj'),
    COUNT(*) FILTER (WHERE activity_type_new = 'crash_test_kick'),
    COUNT(*) FILTER (WHERE activity_type_new = 'heroes_race'),
    COUNT(*) FILTER (WHERE activity_type_new = 'tactics')
  INTO crash_test_bjj_count, crash_test_kick_count, heroes_race_count, tactics_count
  FROM кэмп_активности
  WHERE participant_id = p_participant_id;
  
  -- Расчет баллов по дисциплинам
  SELECT COALESCE(SUM((points * multiplier)::integer), 0)
  INTO bjj_points
  FROM кэмп_активности
  WHERE participant_id = p_participant_id 
    AND (
      (activity_type_new = 'training' AND training_subtype = 'bjj') OR
      (activity_type_new = 'crash_test_bjj')
    );
  
  SELECT COALESCE(SUM((points * multiplier)::integer), 0)
  INTO kick_points
  FROM кэмп_активности
  WHERE participant_id = p_participant_id 
    AND (
      (activity_type_new = 'training' AND training_subtype = 'kick') OR
      (activity_type_new = 'crash_test_kick')
    );
  
  SELECT COALESCE(SUM((points * multiplier)::integer), 0)
  INTO ofp_points
  FROM кэмп_активности
  WHERE participant_id = p_participant_id 
    AND (
      (activity_type_new = 'training' AND training_subtype = 'ofp') OR
      (activity_type_new = 'heroes_race')
    );
  
  SELECT COALESCE(SUM((points * multiplier)::integer), 0)
  INTO kemp_points
  FROM кэмп_активности
  WHERE participant_id = p_participant_id 
    AND activity_type_new IN ('lecture', 'homework')
    AND lecture_subtype = 'kemp';
  
  SELECT COALESCE(SUM((points * multiplier)::integer), 0)
  INTO nutrition_points
  FROM кэмп_активности
  WHERE participant_id = p_participant_id 
    AND activity_type_new IN ('lecture', 'homework')
    AND lecture_subtype = 'nutrition';
  
  SELECT COALESCE(SUM((points * multiplier)::integer), 0)
  INTO tactics_points
  FROM кэмп_активности
  WHERE participant_id = p_participant_id 
    AND activity_type_new = 'tactics';
  
  -- Подсчет общих баллов
  SELECT COALESCE(SUM((points * multiplier)::integer), 0)
  INTO total_points
  FROM кэмп_активности
  WHERE participant_id = p_participant_id AND activity_type_new != 'ascetic';
  
  result := jsonb_build_object(
    'training_counts', jsonb_build_object(
      'bjj', bjj_training_count,
      'kick', kick_training_count,
      'ofp', ofp_training_count
    ),
    'lectures_homework', jsonb_build_object(
      'kemp_lectures', kemp_lectures,
      'kemp_homework', kemp_homework,
      'nutrition_lectures', nutrition_lectures,
      'nutrition_homework', nutrition_homework
    ),
    'trials', jsonb_build_object(
      'crash_test_bjj', crash_test_bjj_count,
      'crash_test_kick', crash_test_kick_count,
      'heroes_race', heroes_race_count,
      'tactics', tactics_count
    ),
    'discipline_points', jsonb_build_object(
      'bjj', bjj_points,
      'kick', kick_points,
      'ofp', ofp_points,
      'kemp', kemp_points,
      'nutrition', nutrition_points,
      'tactics', tactics_points
    ),
    'total_points', total_points
  );
  
  RETURN result;
END;
$$;

-- Обновляем функцию проверки и присуждения тотемов
CREATE OR REPLACE FUNCTION check_and_award_totems_new(p_participant_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  progress_data JSONB;
  awarded_totems TEXT[] := '{}';
  discipline_points JSONB;
  trials JSONB;
BEGIN
  -- Получаем прогресс участника
  SELECT calculate_participant_progress_new(p_participant_id) INTO progress_data;
  
  discipline_points := progress_data->'discipline_points';
  trials := progress_data->'trials';
  
  -- Тотем "Змей" (БЖЖ): ≥12 баллов + краш-тест обязателен
  IF (discipline_points->>'bjj')::INTEGER >= 12 AND (trials->>'crash_test_bjj')::INTEGER >= 1 THEN
    IF NOT EXISTS (SELECT 1 FROM тотемы_участников WHERE participant_id = p_participant_id AND totem_type = 'snake') THEN
      INSERT INTO тотемы_участников (participant_id, totem_type, requirements_met)
      VALUES (p_participant_id, 'snake', jsonb_build_object('bjj_points', (discipline_points->>'bjj')::INTEGER, 'crash_test_bjj', (trials->>'crash_test_bjj')::INTEGER));
      awarded_totems := array_append(awarded_totems, 'snake');
    END IF;
  END IF;
  
  -- Тотем "Лапа" (Кикбоксинг): ≥12 баллов + краш-тест обязателен
  IF (discipline_points->>'kick')::INTEGER >= 12 AND (trials->>'crash_test_kick')::INTEGER >= 1 THEN
    IF NOT EXISTS (SELECT 1 FROM тотемы_участников WHERE participant_id = p_participant_id AND totem_type = 'paw') THEN
      INSERT INTO тотемы_участников (participant_id, totem_type, requirements_met)
      VALUES (p_participant_id, 'paw', jsonb_build_object('kick_points', (discipline_points->>'kick')::INTEGER, 'crash_test_kick', (trials->>'crash_test_kick')::INTEGER));
      awarded_totems := array_append(awarded_totems, 'paw');
    END IF;
  END IF;
  
  -- Тотем "Молот" (ОФП): ≥16 баллов + гонка героев обязательна
  IF (discipline_points->>'ofp')::INTEGER >= 16 AND (trials->>'heroes_race')::INTEGER >= 1 THEN
    IF NOT EXISTS (SELECT 1 FROM тотемы_участников WHERE participant_id = p_participant_id AND totem_type = 'hammer') THEN
      INSERT INTO тотемы_участников (participant_id, totem_type, requirements_met)
      VALUES (p_participant_id, 'hammer', jsonb_build_object('ofp_points', (discipline_points->>'ofp')::INTEGER, 'heroes_race', (trials->>'heroes_race')::INTEGER));
      awarded_totems := array_append(awarded_totems, 'hammer');
    END IF;
  END IF;
  
  -- Тотем "Звезда" (Пирамида КЭМП): ≥11 баллов
  IF (discipline_points->>'kemp')::INTEGER >= 11 THEN
    IF NOT EXISTS (SELECT 1 FROM тотемы_участников WHERE participant_id = p_participant_id AND totem_type = 'star') THEN
      INSERT INTO тотемы_участников (participant_id, totem_type, requirements_met)
      VALUES (p_participant_id, 'star', jsonb_build_object('kemp_points', (discipline_points->>'kemp')::INTEGER));
      awarded_totems := array_append(awarded_totems, 'star');
    END IF;
  END IF;
  
  -- Тотем "Росток" (Нутрициология): ≥11 баллов  
  IF (discipline_points->>'nutrition')::INTEGER >= 11 THEN
    IF NOT EXISTS (SELECT 1 FROM тотемы_участников WHERE participant_id = p_participant_id AND totem_type = 'sprout') THEN
      INSERT INTO тотемы_участников (participant_id, totem_type, requirements_met)
      VALUES (p_participant_id, 'sprout', jsonb_build_object('nutrition_points', (discipline_points->>'nutrition')::INTEGER));
      awarded_totems := array_append(awarded_totems, 'sprout');
    END IF;
  END IF;
  
  -- Тотем "Компас" (Тактика): =9 баллов (3×3)
  IF (discipline_points->>'tactics')::INTEGER = 9 THEN
    IF NOT EXISTS (SELECT 1 FROM тотемы_участников WHERE participant_id = p_participant_id AND totem_type = 'compass') THEN
      INSERT INTO тотемы_участников (participant_id, totem_type, requirements_met)
      VALUES (p_participant_id, 'compass', jsonb_build_object('tactics_points', (discipline_points->>'tactics')::INTEGER));
      awarded_totems := array_append(awarded_totems, 'compass');
    END IF;
  END IF;
  
  -- Тотем "Клинок" (Испытания): все три шрама
  IF (trials->>'crash_test_bjj')::INTEGER >= 1 AND (trials->>'crash_test_kick')::INTEGER >= 1 AND (trials->>'heroes_race')::INTEGER >= 1 THEN
    IF NOT EXISTS (SELECT 1 FROM тотемы_участников WHERE participant_id = p_participant_id AND totem_type = 'blade') THEN
      INSERT INTO тотемы_участников (participant_id, totem_type, requirements_met)
      VALUES (p_participant_id, 'blade', jsonb_build_object('crash_test_bjj', (trials->>'crash_test_bjj')::INTEGER, 'crash_test_kick', (trials->>'crash_test_kick')::INTEGER, 'heroes_race', (trials->>'heroes_race')::INTEGER));
      awarded_totems := array_append(awarded_totems, 'blade');
    END IF;
  END IF;
  
  RETURN jsonb_build_object('awarded_totems', awarded_totems, 'progress', progress_data);
END;
$$;

-- Создаем триггер для автоматической проверки тотемов
CREATE OR REPLACE FUNCTION auto_check_totems_trigger_new()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Автоматически проверяем и присуждаем тотемы после добавления новой активности
  SELECT check_and_award_totems_new(NEW.participant_id) INTO result;
  
  RETURN NEW;
END;
$$;

-- Обновляем требования тотемов в справочной таблице
DELETE FROM требования_тотемов;

INSERT INTO требования_тотемов (totem_type, name, description, requirements, icon) VALUES
('snake', 'Змей', 'БЖЖ: Краш-тест обязателен + тренировки', 
 '{"min_points": 12, "required_trials": ["crash_test_bjj"], "discipline": "bjj"}'::jsonb, '🐍'),
('paw', 'Лапа', 'Кикбоксинг: Краш-тест обязателен + тренировки', 
 '{"min_points": 12, "required_trials": ["crash_test_kick"], "discipline": "kick"}'::jsonb, '🐾'),
('hammer', 'Молот', 'ОФП: Гонка героев обязательна + тренировки', 
 '{"min_points": 16, "required_trials": ["heroes_race"], "discipline": "ofp"}'::jsonb, '🔨'),
('star', 'Звезда', 'Пирамида КЭМП: 6 очных лекций + 6 ДЗ', 
 '{"min_points": 11, "discipline": "kemp"}'::jsonb, '⭐'),
('sprout', 'Росток', 'Нутрициология: 6 очных лекций + 6 ДЗ', 
 '{"min_points": 11, "discipline": "nutrition"}'::jsonb, '🌱'),
('compass', 'Компас', 'Тактика: 3 выезда-зачёта', 
 '{"exact_points": 9, "discipline": "tactics"}'::jsonb, '🧭'),
('monk', 'Монах', 'Аскезы: 2 челленджа ×14 дней, ≥85% каждый', 
 '{"ascetic_challenges": 2, "min_completion": 85}'::jsonb, '🧘'),
('blade', 'Клинок', 'Испытания: все три шрама получены', 
 '{"required_trials": ["crash_test_bjj", "crash_test_kick", "heroes_race"]}'::jsonb, '⚔️'),
('beacon', 'Маяк', 'Особый: за вклад/служение', 
 '{"manual_award": true, "description": "По решению руководителя клуба"}'::jsonb, '🗼'),
('bear', 'Медведь', 'Супер-тотем: за особые достижения', 
 '{"manual_award": true, "description": "По решению руководителя клуба"}'::jsonb, '🐻');