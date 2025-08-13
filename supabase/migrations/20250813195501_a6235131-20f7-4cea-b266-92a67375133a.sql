-- Create achievement types table
CREATE TABLE public.achievement_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  color text NOT NULL,
  icon text NOT NULL,
  shape text NOT NULL, -- 'circle', 'square', 'triangle'  
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create directions table
CREATE TABLE public.directions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  totem_name text,
  totem_icon text,
  totem_description text,
  required_activities integer DEFAULT 0,
  required_lectures integer DEFAULT 0,
  has_final_test boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create totems table
CREATE TABLE public.totems (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  direction_id uuid REFERENCES public.directions(id),
  requirements text, -- JSON string with requirements
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id uuid NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  achievement_type_id uuid NOT NULL REFERENCES public.achievement_types(id),
  activity_id uuid REFERENCES public.activities(id),
  direction_id uuid REFERENCES public.directions(id),
  totem_id uuid REFERENCES public.totems(id),
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  position integer, -- position on bracelet (1-24)
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create direction progress table
CREATE TABLE public.direction_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id uuid NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  direction_id uuid NOT NULL REFERENCES public.directions(id),
  activities_completed integer DEFAULT 0,
  lectures_completed integer DEFAULT 0,
  final_test_passed boolean DEFAULT false,
  totem_earned boolean DEFAULT false,
  progress_percentage decimal(5,2) DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(participant_id, direction_id)
);

-- Create special badges table
CREATE TABLE public.special_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  criteria text, -- JSON string with criteria
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user special badges table
CREATE TABLE public.user_special_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id uuid NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.special_badges(id),
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(participant_id, badge_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.achievement_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.totems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direction_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_special_badges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read access for achievement_types" ON public.achievement_types FOR SELECT USING (true);
CREATE POLICY "Allow public read access for directions" ON public.directions FOR SELECT USING (true);
CREATE POLICY "Allow public read access for totems" ON public.totems FOR SELECT USING (true);
CREATE POLICY "Allow public read access for user_achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Allow public read access for direction_progress" ON public.direction_progress FOR SELECT USING (true);
CREATE POLICY "Allow public read access for special_badges" ON public.special_badges FOR SELECT USING (true);
CREATE POLICY "Allow public read access for user_special_badges" ON public.user_special_badges FOR SELECT USING (true);

-- Insert initial achievement types
INSERT INTO public.achievement_types (name, description, color, icon, shape) VALUES 
('Закал', 'За тренировки БЖЖ, кикбоксинг, ОФП', 'emerald', 'Target', 'circle'),
('Грань', 'За лекции и практику по Пирамиде КЭМП', 'blue', 'Book', 'square'),
('Шрам', 'За испытания и краш-тесты', 'red', 'Zap', 'triangle'),
('Тотем', 'За полное прохождение направления', 'amber', 'Trophy', 'special');

-- Insert directions
INSERT INTO public.directions (name, description, totem_name, totem_icon, totem_description, required_activities, required_lectures, has_final_test) VALUES 
('БЖЖ', 'Бразильское джиу-джитсу', 'Змей', 'Waves', 'Символ контроля и техники', 4, 0, true),
('Кикбоксинг', 'Кикбоксинг и ударная техника', 'Лапа', 'Zap', 'Символ мощного удара', 4, 0, true),
('ОФП', 'Общая физическая подготовка', 'Молот', 'Dumbbell', 'Символ силы и выносливости', 4, 0, false),
('Пирамида КЭМП', 'Теоретические основы системы КЭМП', 'Звезда', 'Star', 'Символ осознанности и структуры', 0, 6, false),
('Нутрициология', 'Правильное питание и восстановление', 'Росток', 'Leaf', 'Символ роста и восстановления', 0, 6, false),
('Тактика и ТакМед', 'Тактическая подготовка и медицина', 'Компас', 'Compass', 'Символ ориентации и выживания', 2, 4, true),
('Аскезы', 'Челленджи и дисциплинарные практики', 'Монах', 'Mountain', 'Символ дисциплины и стойкости', 5, 0, false),
('Испытания', 'Краш-тесты и Гонка героев', 'Клинок', 'Sword', 'Символ преодоления испытаний', 3, 0, true);

-- Insert totems based on directions
INSERT INTO public.totems (name, description, icon, direction_id, requirements)
SELECT 
  d.totem_name,
  d.totem_description,
  d.totem_icon,
  d.id,
  json_build_object(
    'activities', d.required_activities,
    'lectures', d.required_lectures,
    'final_test', d.has_final_test
  )::text
FROM public.directions d;

-- Insert special badges
INSERT INTO public.special_badges (name, description, icon, criteria) VALUES 
('Лучший сброс веса', 'За наибольшую потерю веса за месяц', 'TrendingDown', '{"type": "weight_loss", "period": "month"}'),
('Самый быстрый нокаут', 'За самый быстрый нокаут в спарринге', 'Zap', '{"type": "knockout", "time": "fastest"}'),
('Железная дисциплина', 'За 30 дней без пропусков тренировок', 'Shield', '{"type": "attendance", "days": 30}'),
('Первая кровь', 'За первое участие в спарринге', 'Droplet', '{"type": "first_sparring"}'),
('Наставник', 'За помощь новичкам', 'Users', '{"type": "mentoring", "count": 5}');

-- Create trigger function to update direction progress
CREATE OR REPLACE FUNCTION public.update_direction_progress()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for updating progress
CREATE TRIGGER update_direction_progress_trigger
  AFTER INSERT ON public.user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_direction_progress();