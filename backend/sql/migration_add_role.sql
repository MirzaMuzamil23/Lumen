ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
  ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));

-- Kisi user ko admin banane ke liye (apna email daalein):
-- UPDATE users SET role = 'admin' WHERE email = 'you@example.com';