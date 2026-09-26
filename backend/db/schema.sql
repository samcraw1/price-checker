CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image_url TEXT NOT NULL,
    price_history NUMERIC[] NOT NULL DEFAULT '{}',
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE listings_history (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    price NUMERIC NOT NULL,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
