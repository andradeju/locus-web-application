INSERT INTO users (id, name, cpf, birth_date, password_hash, role)
VALUES (
           gen_random_uuid(),
           'Admin',
           '98765432100',
           '1990-01-01',
           '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
           'ADMIN'
       ) ON CONFLICT DO NOTHING;