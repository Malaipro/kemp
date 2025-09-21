# Настройка Edge Functions для нового проекта

## 1. Копирование Edge Functions

Скопируйте папку `supabase/functions/` в новый проект.

Имеющиеся функции:
- `create-user/index.ts`
- `nodul-webhook/index.ts` 
- `send-welcome-email/index.ts`
- `zapier-webhook/index.ts`

## 2. Обновление конфигурации (config.toml)

```toml
project_id = "jbotyvommxeoyhrmdfic"

[api]
enabled = true
port = 54321
schemas = ["public", "storage", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[functions.zapier-webhook]
verify_jwt = false

[functions.nodul-webhook]
verify_jwt = false

[functions.send-welcome-email]
verify_jwt = false
```

## 3. Настройка секретов

В новом проекте установите следующие секреты через Dashboard:

- `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key нового проекта
- `RESEND_API_KEY` - ваш API ключ Resend
- `SUPABASE_ANON_KEY` - Anon Key нового проекта  
- `SUPABASE_URL` - https://jbotyvommxeoyhrmdfic.supabase.co
- `SUPABASE_DB_URL` - postgresql://postgres:[PASSWORD]@db.jbotyvommxeoyhrmdfic.supabase.co:5432/postgres
- `SUPABASE_PUBLISHABLE_KEY` - Anon Key (дубликат)

## 4. Деплой функций

После настройки секретов выполните:

```bash
supabase functions deploy --project-ref jbotyvommxeoyhrmdfic
```

## 5. Проверка

Проверьте что все функции работают в разделе Edge Functions нового проекта.