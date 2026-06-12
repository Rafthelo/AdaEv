-- =====================================================
-- Seed 003: Usuario administrador por defecto
-- Password: Admin2024!
-- =====================================================

USE adaev;

INSERT IGNORE INTO users (username, email, password_hash, first_name, last_name) VALUES (
  'admin',
  'admin@adaev.com',
  '$2b$12$QvxY/DJZXQigUi77gKN7JOlGUXtjmqBneHWhcfWlJz2w1mE1fpwMC',
  'Admin',
  'AdaEv'
);

-- Asignar rol superadmin al usuario admin
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin'
  AND r.name = 'superadmin';