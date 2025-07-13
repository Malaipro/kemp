-- Обновляем существующие активности с новыми баллами
UPDATE public.activities 
SET points = CASE 
  WHEN title = 'Тренировка' THEN 1
  WHEN title = 'Утренняя тренировка' THEN 1
  WHEN title = 'Закаливание' THEN 1
  WHEN title = 'Правильное питание' THEN 1
  WHEN title = 'Посещение лекций и мастер классов' THEN 1
  WHEN title = 'Участие в финальном испытании' THEN 3
  ELSE points
END;

-- Обновляем название "Утренняя тренировка" на "Самостоятельная тренировка"
UPDATE public.activities 
SET title = 'Самостоятельная тренировка'
WHERE title = 'Утренняя тренировка';

-- Добавляем новую активность "Публикация в соц. сети", если её ещё нет
INSERT INTO public.activities (title, icon, points)
SELECT 'Публикация в соц. сети', 'Share2', 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.activities WHERE title = 'Публикация в соц. сети'
);