-- Добавляем таблицу для результатов теста Купера
CREATE TABLE public.cooper_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL,
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  distance_meters INTEGER NOT NULL,
  time_minutes INTEGER NOT NULL DEFAULT 12,
  fitness_level TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (participant_id) REFERENCES участники(id) ON DELETE CASCADE
);

-- Включаем RLS
ALTER TABLE public.cooper_test_results ENABLE ROW LEVEL SECURITY;

-- Политики для результатов теста Купера
CREATE POLICY "Users can view their own Cooper test results" 
ON public.cooper_test_results 
FOR SELECT 
USING (participant_id IN (
  SELECT id FROM участники WHERE user_id = auth.uid()
));

CREATE POLICY "Users can insert their own Cooper test results" 
ON public.cooper_test_results 
FOR INSERT 
WITH CHECK (participant_id IN (
  SELECT id FROM участники WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update their own Cooper test results" 
ON public.cooper_test_results 
FOR UPDATE 
USING (participant_id IN (
  SELECT id FROM участники WHERE user_id = auth.uid()
));

CREATE POLICY "Super admin can manage all Cooper test results" 
ON public.cooper_test_results 
FOR ALL 
USING (is_super_admin(auth.uid()));

-- Добавляем таблицу для расписания
CREATE TABLE public.schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = воскресенье, 6 = суббота
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  activity_name TEXT NOT NULL,
  location TEXT,
  instructor TEXT,
  max_participants INTEGER,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для расписания
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;

-- Политики для расписания
CREATE POLICY "Public can view active schedule" 
ON public.schedule 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Super admin can manage schedule" 
ON public.schedule 
FOR ALL 
USING (is_super_admin(auth.uid()));

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_cooper_test_results_updated_at
BEFORE UPDATE ON public.cooper_test_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_updated_at
BEFORE UPDATE ON public.schedule
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();