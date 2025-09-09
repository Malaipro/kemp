-- Таблица для управления тренерами
CREATE TABLE public.trainers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  image_url text,
  quote text,
  experience text,
  bio text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Таблица для контента страниц
CREATE TABLE public.page_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name text NOT NULL, -- 'hero', 'about', 'philosophy', etc.
  section_name text NOT NULL, -- 'title', 'subtitle', 'description', etc.
  content_type text NOT NULL DEFAULT 'text', -- 'text', 'image', 'html'
  content_value text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(page_name, section_name)
);

-- Таблица для программ тренировок
CREATE TABLE public.training_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text,
  benefits jsonb, -- массив преимуществ
  features jsonb, -- массив особенностей
  price_info text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Таблица для галереи
CREATE TABLE public.gallery_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  image_url text NOT NULL,
  description text,
  category text DEFAULT 'general', -- 'training', 'events', 'facilities', etc.
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Включаем RLS для всех таблиц
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Политики для публичного чтения
CREATE POLICY "Public can view active trainers" ON public.trainers 
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active page content" ON public.page_content 
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active training programs" ON public.training_programs 
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active gallery images" ON public.gallery_images 
FOR SELECT USING (is_active = true);

-- Политики для админов (полный доступ)
CREATE POLICY "Super admin can manage trainers" ON public.trainers 
FOR ALL USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admin can manage page content" ON public.page_content 
FOR ALL USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admin can manage training programs" ON public.training_programs 
FOR ALL USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admin can manage gallery images" ON public.gallery_images 
FOR ALL USING (is_super_admin(auth.uid()));

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_trainers_updated_at
  BEFORE UPDATE ON public.trainers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_programs_updated_at
  BEFORE UPDATE ON public.training_programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Заполняем начальные данные для тренеров
INSERT INTO public.trainers (name, role, image_url, quote, bio, sort_order) VALUES
('Дмитрий Андреев', 'Бизнесмен, основатель проекта и руководитель клуба', 'https://imgur.com/zCYntX0.jpeg', 'Джиу-джитсу учит не только технике, но и терпению и стратегическому мышлению.', 'Бизнесмен, сооснователь Ayboost.com и Malai.pro.

Чемпион России по бразильскому джиу-джитсу.

Тренер по кикбоксингу, бразильскому джиу-джитсу и ОФП.

В КЭМПе — хедлайнер, лектор и наставник по Пирамиде КЭМП и тренер по BJJ, кикбоксингу и общей физической подготовке.', 1),

('Али Валеев', 'Инструктор по гонкам с препятствиями, сертифицированный фитнес-инструктор, тренер по кроссфиту', 'https://i.imgur.com/WjrhrWT.jpeg', 'Достигни своего максимума через дисциплину и упорство.', 'Али специализируется на ударной технике и развитии бойцовского духа. Его методики помогают участникам КЭМП существенно улучшить физическую форму в кратчайшие сроки, одновременно развивая ментальную стойкость.', 2),

('Михаил Гришин', 'Интегративный нутрициолог с навыками Health Coach', 'https://i.imgur.com/3WHBCjU.jpeg', 'Правильное питание — основа прогресса и энергии для достижения целей.', 'Михаил разрабатывает индивидуальные планы питания для участников КЭМП, учитывая интенсивность тренировок и персональные особенности. Его рекомендации помогают оптимизировать результаты тренировок и ускорить восстановление.', 3),

('Тагир Ахмеров', 'Основатель парк отель MARI HOLIDAY VILLAGE, инструктор по тактической подготовке КЭМП', '/lovable-uploads/e27de7f5-f9fd-4432-b8b6-b6d2fe2231fc.png', 'Тактическое мышление и готовность к любым ситуациям — ключ к выживанию.', 'Тагир Ахмеров — эксперт по тактической медицине и безопасности. Он обучает самообороне с разрешёнными средствами, практике в реальных сценариях и оказанию первой помощи. Его занятия развивают тактическое мышление, готовность к экстремальным ситуациям и командную работу.', 4);

-- Заполняем начальный контент для страниц
INSERT INTO public.page_content (page_name, section_name, content_value, sort_order) VALUES
('hero', 'title', 'КЭМП', 1),
('hero', 'subtitle', 'Комплексная Экстремальная Мужская Подготовка', 2),
('hero', 'description', 'Тренировочный лагерь для развития боевых навыков, физической формы и ментальной стойкости', 3),

('about', 'title', 'О КЭМП', 1),
('about', 'description', 'КЭМП - это не просто спортивный клуб, это сообщество единомышленников, стремящихся к постоянному саморазвитию и совершенствованию.', 2),

('philosophy', 'title', 'Философия КЭМП', 1),
('philosophy', 'description', 'Наша философия основана на принципах дисциплины, уважения и постоянного самосовершенствования.', 2);

-- Заполняем начальные программы тренировок
INSERT INTO public.training_programs (title, description, benefits, features, sort_order) VALUES
('Бразильское джиу-джитсу', 'Искусство наземного боя и грэпплинга', 
'["Развитие гибкости", "Улучшение координации", "Техника контроля"]',
'["Групповые тренировки", "Индивидуальный подход", "Соревновательная подготовка"]', 1),

('Кикбоксинг', 'Ударная техника и физическая подготовка',
'["Кардиотренировка", "Развитие скорости", "Координация движений"]',
'["Работа на лапах", "Спарринги", "Техническая подготовка"]', 2),

('ОФП', 'Общая физическая подготовка',
'["Развитие силы", "Выносливость", "Функциональная подготовка"]',
'["Круговые тренировки", "Кроссфит элементы", "Восстановление"]', 3);