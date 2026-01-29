-- Seed default admin user (password: admin123)
-- BCrypt hash below is from previous seed; keep for convenience.
INSERT INTO users (email, password_hash, full_name, status, created_at, updated_at)
VALUES (
  'admin@trickcode.com',
  '$2a$10$yqEjQ..XhV2I6gF4c2jXxeU9yxKZ1QOCiaEtJKN7zSu45hxVxdrn2',
  'Admin',
  'ACTIVE',
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;

-- Assign ADMIN role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'ADMIN'
WHERE u.email = 'admin@trickcode.com'
ON CONFLICT DO NOTHING;

