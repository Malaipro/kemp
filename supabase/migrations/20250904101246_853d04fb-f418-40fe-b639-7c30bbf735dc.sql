-- Создаем типы для системы КЭМП
CREATE TYPE public.reward_type AS ENUM ('zakal', 'gran', 'shram', 'totem');
CREATE TYPE public.zakal_subtype AS ENUM ('bjj', 'kick', 'ofp');
CREATE TYPE public.shram_subtype AS ENUM ('bjj', 'kick', 'ofp', 'tactics');
CREATE TYPE public.totem_type AS ENUM ('snake', 'paw', 'hammer', 'star', 'sprout', 'compass', 'monk', 'blade', 'lighthouse', 'bear');

-- Таблица активностей КЭМП
CREATE TABLE public.kamp_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  reward_type public.reward_type NOT NULL,
  zakal_subtype public.zakal_subtype,
  shram_subtype public.shram_subtype,
  points INTEGER NOT NULL DEFAULT 1,
  multiplier DECIMAL(3,1) DEFAULT 1.0,
  description TEXT,
  verified_by TEXT, -- кто подтвердил (тренер/куратор)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Таблица тотемов участников
CREATE TABLE public.participant_totems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  totem_type public.totem_type NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  requirements_met JSONB, -- какие требования были выполнены
  UNIQUE(participant_id, totem_type)
);

-- Таблица аскез
CREATE TABLE public.participant_ascetics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL DEFAULT 14,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  completion_percentage INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица прогресса аскез (ежедневные отметки)
CREATE TABLE public.ascetic_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ascetic_id UUID NOT NULL REFERENCES public.participant_ascetics(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ascetic_id, date)
);

-- Таблица требований для тотемов
CREATE TABLE public.totem_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  totem_type public.totem_type NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirements JSONB NOT NULL, -- структура требований
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.kamp_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_totems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_ascetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ascetic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.totem_requirements ENABLE ROW LEVEL SECURITY;

-- Политики RLS для kamp_activities
CREATE POLICY "Users can view their own kamp activities" 
ON public.kamp_activities 
FOR SELECT 
USING (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

CREATE POLICY "Trainers can insert kamp activities" 
ON public.kamp_activities 
FOR INSERT 
WITH CHECK (true); -- Пока разрешаем всем, потом можно ограничить по ролям

-- Политики RLS для participant_totems
CREATE POLICY "Users can view their own totems" 
ON public.participant_totems 
FOR SELECT 
USING (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

CREATE POLICY "Public read access for totem requirements" 
ON public.totem_requirements 
FOR SELECT 
USING (true);

-- Политики RLS для аскез
CREATE POLICY "Users can manage their own ascetics" 
ON public.participant_ascetics 
FOR ALL 
USING (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()))
WITH CHECK (participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own ascetic progress" 
ON public.ascetic_progress 
FOR ALL 
USING (ascetic_id IN (
  SELECT id FROM public.participant_ascetics 
  WHERE participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid())
))
WITH CHECK (ascetic_id IN (
  SELECT id FROM public.participant_ascetics 
  WHERE participant_id IN (SELECT id FROM public.participants WHERE user_id = auth.uid())
));

-- Заполняем требования для тотемов
INSERT INTO public.totem_requirements (totem_type, name, description, icon, requirements) VALUES
('snake', 'Змей', 'Тотем за направление БЖЖ (контроль)', '🐍', '{"zakal_bjj": 8, "shram_bjj": 1, "attendance": 80}'),
('paw', 'Лапа', 'Тотем за направление Кикбоксинг (удар)', '🐾', '{"zakal_kick": 8, "shram_kick": 1, "attendance": 80}'),
('hammer', 'Молот', 'Тотем за направление ОФП (сила)', '🔨', '{"zakal_ofp": 8, "shram_ofp": 1, "attendance": 80}'),
('star', 'Звезда', 'Тотем за Пирамиду КЭМП (осознанность)', '⭐', '{"lectures": 6, "homework": 6, "min_score": 11}'),
('sprout', 'Росток', 'Тотем за Нутрициологию (восстановление)', '🌱', '{"lectures": 6, "homework": 6, "min_score": 11}'),
('compass', 'Компас', 'Тотем за Тактику (ориентирование)', '🧭', '{"tactics_sessions": 3, "score": 9}'),
('monk', 'Монах', 'Тотем за Аскезы/челленджи (самоконтроль)', '🧘', '{"ascetics": 2, "duration_days": 14, "completion": 85}'),
('blade', 'Клинок', 'Тотем за все Испытания (шрам)', '⚔️', '{"shram_bjj": 1, "shram_kick": 1, "shram_ofp": 1, "min_score": 20}'),
('lighthouse', 'Маяк', 'Особый тотем за вклад/служение клубу', '🏮', '{"special": true, "admin_only": true}'),
('bear', 'Медведь', 'Супер-тотем за особые достижения', '🐻', '{"special": true, "admin_only": true}');

-- Функция для подсчета прогресса участника
CREATE OR REPLACE FUNCTION public.calculate_participant_progress(p_participant_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
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
  FROM public.kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'zakal' AND zakal_subtype = 'bjj';
  
  SELECT COUNT(*) INTO zakal_kick_count 
  FROM public.kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'zakal' AND zakal_subtype = 'kick';
  
  SELECT COUNT(*) INTO zakal_ofp_count 
  FROM public.kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'zakal' AND zakal_subtype = 'ofp';
  
  -- Подсчитываем грани
  SELECT COUNT(*) INTO gran_count 
  FROM public.kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'gran';
  
  -- Подсчитываем шрамы
  SELECT COUNT(*) INTO shram_bjj_count 
  FROM public.kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'bjj';
  
  SELECT COUNT(*) INTO shram_kick_count 
  FROM public.kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'kick';
  
  SELECT COUNT(*) INTO shram_ofp_count 
  FROM public.kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'ofp';
  
  SELECT COUNT(*) INTO shram_tactics_count 
  FROM public.kamp_activities 
  WHERE participant_id = p_participant_id AND reward_type = 'shram' AND shram_subtype = 'tactics';
  
  -- Подсчитываем общие баллы
  SELECT COALESCE(SUM(points * multiplier), 0)::INTEGER INTO total_points 
  FROM public.kamp_activities 
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