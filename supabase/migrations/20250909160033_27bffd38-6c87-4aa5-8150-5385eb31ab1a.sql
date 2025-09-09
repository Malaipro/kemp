-- Add admin role for dishka.da@yandex.ru
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'dishka.da@yandex.ru'
AND NOT EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.users.id AND role = 'admin'::app_role
);