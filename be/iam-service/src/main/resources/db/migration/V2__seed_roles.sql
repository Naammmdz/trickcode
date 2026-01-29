-- Seed Trickcode roles
INSERT INTO roles (name, description) VALUES
('ADMIN', 'Platform administrator with full access'),
('INSTRUCTOR', 'Course author/instructor'),
('STUDENT', 'Regular student user')
ON CONFLICT (name) DO NOTHING;

