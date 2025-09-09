-- Добавляем поддержку подтипов для граней (лекций)
ALTER TABLE public.кэмп_активности 
ADD COLUMN IF NOT EXISTS lecture_subtype lecture_subtype_new;

-- Создаем перечисление для подтипов лекций если его нет
DO $$ BEGIN
    CREATE TYPE public.lecture_subtype_new AS ENUM (
        'homework_pyramid',
        'nutrition'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;