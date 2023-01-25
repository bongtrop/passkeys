DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS public_keys;

CREATE TABLE public_keys (
    kid TEXT PRIMARY KEY,
    cose_alg INT NOT NULL,
    pubkey BLOB NOT NULL,
    attestation_data BLOB,
    user_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);