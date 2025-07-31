-- meta_init.sql

CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    patient_external_code TEXT,
    module TEXT NOT NULL,
    metric TEXT NOT NULL,
    threshold FLOAT NOT NULL,
    condition TEXT NOT NULL,
    email TEXT NOT NULL,
    frequency TEXT DEFAULT 'daily',
    active BOOLEAN DEFAULT TRUE,
    last_triggered TIMESTAMP
);

CREATE TABLE redflags (
    id SERIAL PRIMARY KEY,
    patient_external_code TEXT NOT NULL,
    module TEXT NOT NULL,
    flag_type TEXT NOT NULL,       -- 'red', 'yellow', etc.
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
