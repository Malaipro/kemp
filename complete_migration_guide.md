# Полное руководство по переносу проекта в Supabase

## Шаг 1: Подготовка нового проекта

1. Откройте новый проект: https://supabase.com/dashboard/project/wfjvjvbjjxcgkaolkgdq
2. Перейдите в SQL Editor
3. Выполните полностью файл `migration_export.sql`

## Шаг 2: Настройка Authentication

1. Перейдите в Authentication → Settings → Site URL
2. Установите Site URL: `https://your-domain.com` (или preview URL)
3. Добавьте Redirect URLs для всех доменов где будет работать приложение

## Шаг 3: Настройка Edge Functions

1. Скопируйте папку `supabase/functions/` 
2. Обновите `supabase/config.toml` (используйте данные из `edge_functions_setup.md`)
3. Установите все секреты через Dashboard → Settings → Edge Functions
4. Выполните деплой: `supabase functions deploy --project-ref wfjvjvbjjxcgkaolkgdq`

## Шаг 4: Обновление кода приложения

Код уже обновлен для подключения к новому проекту:
- `src/integrations/supabase/client.ts`
- `supabase/config.toml`

## Шаг 5: Проверка работы

1. Проверьте что авторизация работает
2. Проверьте что данные загружаются корректно
3. Проверьте работу Edge Functions в логах

## Что уже перенесено:

### Данные:
- ✅ 3 участника с активностями
- ✅ 9 заявок на курсы  
- ✅ 2 потока интенсивов
- ✅ Роли пользователей

### Структура:
- ✅ Все таблицы и типы
- ✅ Функции безопасности
- ✅ RLS политики
- ✅ Триггеры

### Функции:
- ✅ create-user
- ✅ nodul-webhook
- ✅ send-welcome-email  
- ✅ zapier-webhook

## Важно!

После выполнения миграции старый проект можно будет отключить, так как все данные и настройки будут перенесены в новый проект.