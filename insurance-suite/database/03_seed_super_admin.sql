-- 03_seed_super_admin.sql
INSERT INTO users (role, name, email, phone_no, password_hash)
VALUES ('super_admin','Super Admin','superadmin@example.com','9999999999', crypt('ChangeMe123!','bf'))
ON CONFLICT (email) DO NOTHING;
