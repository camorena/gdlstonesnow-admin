-- =============================================================================
-- GDL Stone Snow Admin - Supabase SQL Schema
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- SITE SETTINGS
-- =============================================================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL CHECK (length(address_state) = 2),
  address_zip TEXT NOT NULL CHECK (address_zip ~ '^\d{5}$'),
  phone_office TEXT NOT NULL,
  phone_sales TEXT,
  email TEXT NOT NULL,
  hours TEXT NOT NULL DEFAULT 'Always Open',
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  google_maps_embed_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- SLIDER SLIDES
-- =============================================================================
CREATE TABLE slider_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  cta_text TEXT,
  cta_link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_slider_slides_sort_order ON slider_slides (sort_order);
CREATE INDEX idx_slider_slides_is_active ON slider_slides (is_active);

-- =============================================================================
-- SERVICES & SERVICE ITEMS
-- =============================================================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_alt TEXT NOT NULL DEFAULT '',
  icon_class TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_sort_order ON services (sort_order);
CREATE INDEX idx_services_is_active ON services (is_active);

CREATE TABLE service_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_items_service_id ON service_items (service_id);
CREATE INDEX idx_service_items_sort_order ON service_items (sort_order);
CREATE INDEX idx_service_items_is_active ON service_items (is_active);

-- =============================================================================
-- GALLERY ITEMS
-- =============================================================================
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT NOT NULL DEFAULT '',
  title TEXT,
  category TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_items_sort_order ON gallery_items (sort_order);
CREATE INDEX idx_gallery_items_is_active ON gallery_items (is_active);

-- =============================================================================
-- PROMOTIONS & PROMOTION ITEMS
-- =============================================================================
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  season TEXT CHECK (season IN ('spring', 'summer', 'fall', 'winter')),
  image_url TEXT,
  image_alt TEXT NOT NULL DEFAULT '',
  icon_class TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_promotions_sort_order ON promotions (sort_order);
CREATE INDEX idx_promotions_is_active ON promotions (is_active);

CREATE TABLE promotion_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_promotion_items_promotion_id ON promotion_items (promotion_id);
CREATE INDEX idx_promotion_items_sort_order ON promotion_items (sort_order);
CREATE INDEX idx_promotion_items_is_active ON promotion_items (is_active);

-- =============================================================================
-- TESTIMONIALS
-- =============================================================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_location TEXT,
  author_title TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_testimonials_sort_order ON testimonials (sort_order);
CREATE INDEX idx_testimonials_is_active ON testimonials (is_active);

-- =============================================================================
-- CONTENT BLOCKS
-- =============================================================================
CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  body TEXT NOT NULL,
  page TEXT NOT NULL DEFAULT 'home',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_blocks_slug ON content_blocks (slug);
CREATE INDEX idx_content_blocks_page ON content_blocks (page);
CREATE INDEX idx_content_blocks_sort_order ON content_blocks (sort_order);
CREATE INDEX idx_content_blocks_is_active ON content_blocks (is_active);

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON slider_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON service_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON gallery_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON promotion_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE slider_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Authenticated users: full access on all tables
CREATE POLICY "Authenticated users have full access to site_settings"
  ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to slider_slides"
  ON slider_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to services"
  ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to service_items"
  ON service_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to gallery_items"
  ON gallery_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to promotions"
  ON promotions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to promotion_items"
  ON promotion_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to testimonials"
  ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to content_blocks"
  ON content_blocks FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Anonymous users: read-only access on public-facing tables
CREATE POLICY "Anonymous users can read site_settings"
  ON site_settings FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous users can read active slider_slides"
  ON slider_slides FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Anonymous users can read active services"
  ON services FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Anonymous users can read active service_items"
  ON service_items FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Anonymous users can read active gallery_items"
  ON gallery_items FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Anonymous users can read active promotions"
  ON promotions FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Anonymous users can read active promotion_items"
  ON promotion_items FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Anonymous users can read active testimonials"
  ON testimonials FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Anonymous users can read active content_blocks"
  ON content_blocks FOR SELECT TO anon USING (is_active = true);
