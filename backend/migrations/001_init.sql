CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  customer_name TEXT NOT NULL,
  phone_raw TEXT NOT NULL,
  phone_e164 TEXT NOT NULL,
  email TEXT,
  country TEXT DEFAULT 'SA',
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'SAR',
  payment_method TEXT NOT NULL DEFAULT 'COD',
  ip TEXT,
  user_agent TEXT,
  utm_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  attribution_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  maxmind_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  sheet_sync_status TEXT DEFAULT 'pending',
  meta_capi_status TEXT DEFAULT 'pending',
  tiktok_capi_status TEXT DEFAULT 'pending',
  snap_capi_status TEXT DEFAULT 'pending',
  agent_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_phone_e164_idx ON orders (phone_e164);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);

CREATE TABLE IF NOT EXISTS products (
  sku TEXT PRIMARY KEY,
  product_id TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  price NUMERIC(12,2) NOT NULL,
  compare_at NUMERIC(12,2),
  cost NUMERIC(12,2),
  stock INTEGER NOT NULL DEFAULT 0,
  main_image TEXT,
  images_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);