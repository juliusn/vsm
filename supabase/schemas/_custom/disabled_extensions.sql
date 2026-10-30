-- Supabase shadow databases include these extensions by default, but this
-- project intentionally removed them in its existing migration history.
-- Keep the declarative target consistent with that history.
DROP EXTENSION IF EXISTS "pgcrypto";
DROP EXTENSION IF EXISTS "uuid-ossp";
