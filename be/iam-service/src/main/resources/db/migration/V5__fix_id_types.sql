-- Fix id column types to match Java Long mappings (BIGINT)
-- Existing DB was created with SERIAL (INTEGER) for roles/permissions ids.

-- ROLES
ALTER TABLE IF EXISTS roles ALTER COLUMN id TYPE BIGINT;

-- PERMISSIONS
ALTER TABLE IF EXISTS permissions ALTER COLUMN id TYPE BIGINT;

