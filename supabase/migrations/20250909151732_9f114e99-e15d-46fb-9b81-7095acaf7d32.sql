-- Расширяем таблицу расписания для поддержки детального расписания потока
ALTER TABLE schedule 
ADD COLUMN IF NOT EXISTS date_specific DATE,
ADD COLUMN IF NOT EXISTS ascetic_meaning_kemp TEXT,
ADD COLUMN IF NOT EXISTS ascetic_meaning_nutrition TEXT,
ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'training',
ADD COLUMN IF NOT EXISTS lecturer TEXT,
ADD COLUMN IF NOT EXISTS highlight_color TEXT;

-- Обновляем комментарии для ясности
COMMENT ON COLUMN schedule.date_specific IS 'Конкретная дата проведения мероприятия';
COMMENT ON COLUMN schedule.ascetic_meaning_kemp IS 'Смысл аскезы/Парамата КЭМП';
COMMENT ON COLUMN schedule.ascetic_meaning_nutrition IS 'Смысл аскезы/Нутрициология';
COMMENT ON COLUMN schedule.event_type IS 'Тип мероприятия: training, lecture, test, special';
COMMENT ON COLUMN schedule.lecturer IS 'Лектор/Инструктор проводящий мероприятие';
COMMENT ON COLUMN schedule.highlight_color IS 'Цвет выделения строки: red, yellow, green, blue';

-- Создаем enum для типов мероприятий
DO $$ BEGIN
    CREATE TYPE event_type_enum AS ENUM ('training', 'lecture', 'test', 'special');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Создаем enum для цветов выделения
DO $$ BEGIN
    CREATE TYPE highlight_color_enum AS ENUM ('none', 'red', 'yellow', 'green', 'blue');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;