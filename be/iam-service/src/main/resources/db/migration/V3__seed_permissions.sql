-- Seed Trickcode permissions (minimal but extensible)
INSERT INTO permissions (name, description, resource_type, action_type) VALUES
('COURSE_VIEW', 'View courses', 'COURSE', 'VIEW'),
('COURSE_MANAGE', 'Create/update/delete courses', 'COURSE', 'MANAGE'),
('ENROLLMENT_VIEW', 'View enrollments', 'ENROLLMENT', 'VIEW'),
('ENROLLMENT_MANAGE', 'Manage enrollments', 'ENROLLMENT', 'MANAGE'),
('BILLING_VIEW', 'View billing/transactions', 'BILLING', 'VIEW'),
('BILLING_MANAGE', 'Manage billing/refunds', 'BILLING', 'MANAGE'),
('USER_VIEW', 'View users', 'USER', 'VIEW'),
('USER_MANAGE', 'Manage users', 'USER', 'MANAGE'),
('ROLE_VIEW', 'View roles', 'ROLE', 'VIEW'),
('ROLE_MANAGE', 'Manage roles', 'ROLE', 'MANAGE')
ON CONFLICT (name) DO NOTHING;

-- Map permissions to roles
-- ADMIN gets everything
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON true
WHERE r.name = 'ADMIN'
ON CONFLICT DO NOTHING;

-- INSTRUCTOR can view/manage courses
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN ('COURSE_VIEW', 'COURSE_MANAGE')
WHERE r.name = 'INSTRUCTOR'
ON CONFLICT DO NOTHING;

-- STUDENT can view courses/enrollments/billing
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN ('COURSE_VIEW', 'ENROLLMENT_VIEW', 'BILLING_VIEW')
WHERE r.name = 'STUDENT'
ON CONFLICT DO NOTHING;

