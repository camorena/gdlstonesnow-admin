-- =============================================================================
-- GDL Stone Snow Admin - Seed Data
-- Extracted from the current gdlstonesnow.com website
-- =============================================================================

-- =============================================================================
-- SITE SETTINGS
-- =============================================================================
INSERT INTO site_settings (
  business_name,
  address_street,
  address_city,
  address_state,
  address_zip,
  phone_office,
  phone_sales,
  email,
  hours,
  facebook_url,
  instagram_url,
  youtube_url,
  google_maps_embed_url,
  logo_url
) VALUES (
  'GDL Stone Snow LLC',
  '1000 W. 94th St.',
  'Bloomington',
  'MN',
  '55420',
  '(952) 882-6182',
  '(612) 236-6190',
  'camoren000@gmail.com',
  'Always Open',
  'https://m.facebook.com/GDLStoneSnow/?_rdr',
  'https://instagram.com/gdlstonesnowllc',
  'https://www.youtube.com/channel/UC4ingZfTXS1jpl1vKMjNVJw/videos',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2826.5!2d-93.2866!3d44.8408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f6276e1e6e0e5d%3A0x0!2s1000+W+94th+St%2C+Bloomington%2C+MN+55420!5e0!3m2!1sen!2sus!4v1',
  'images/logo.png'
);

-- =============================================================================
-- SLIDER SLIDES
-- =============================================================================
INSERT INTO slider_slides (image_url, image_alt, headline, subtitle, cta_text, cta_link, sort_order) VALUES
(
  'images/slider/slider-1-1.jpg',
  'Professional landscape maintenance services in Bloomington MN',
  'Complete grounds maintenance services to suit any budget.',
  'Landscape Maintenance Service',
  'GET A NO OBLIGATION QUOTE TODAY!',
  'contact.html',
  1
),
(
  'images/slider/slider-1-1.jpg',
  'Lawn care and grounds maintenance by GDL Stone Snow',
  'Lawn care Maintenance',
  'CONTINUOUS PURSUIT FOR PERFECTION',
  'GET A FREE ESTIMATE!',
  'contact.html',
  2
),
(
  'images/slider/slider-1-3.jpg',
  'Winter snow removal and ice control services in Minneapolis-St. Paul',
  'Discover what we can do',
  'WINTER SERVICES TO KEEP YOU UP & RUNNING',
  'CONTACT US!',
  'contact.html',
  3
);

-- =============================================================================
-- SERVICES & SERVICE ITEMS
-- =============================================================================

-- Lawn Care
INSERT INTO services (id, title, description, image_url, image_alt, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Lawn Care', NULL, 'images/pages/480x320/gallery-2.jpg', 'Professional lawn care service by GDL Stone Snow in Bloomington MN', 1);

INSERT INTO service_items (service_id, title, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Spring/fall clean up', 1),
  ('a0000000-0000-0000-0000-000000000001', 'Weekly maintenance', 2),
  ('a0000000-0000-0000-0000-000000000001', 'Treatment & Fertilization', 3),
  ('a0000000-0000-0000-0000-000000000001', 'Weed control & Spraying', 4),
  ('a0000000-0000-0000-0000-000000000001', 'Trimming & Pruning', 5),
  ('a0000000-0000-0000-0000-000000000001', 'Full range of tree services', 6),
  ('a0000000-0000-0000-0000-000000000001', 'Lawn Aeration & Reseeding', 7);

-- Irrigation
INSERT INTO services (id, title, description, image_url, image_alt, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000002', 'Irrigation', NULL, 'images/pages/480x320/gallery-16.jpg', 'Sprinkler irrigation system installation and maintenance', 2);

INSERT INTO service_items (service_id, title, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000002', 'Commercial sprinkler systems', 1),
  ('a0000000-0000-0000-0000-000000000002', 'Residential sprinkler systems', 2),
  ('a0000000-0000-0000-0000-000000000002', 'Irrigation Full service', 3),
  ('a0000000-0000-0000-0000-000000000002', 'Irrigation maintenance', 4),
  ('a0000000-0000-0000-0000-000000000002', 'Troubleshooting & repair', 5);

-- Stone and Masonry
INSERT INTO services (id, title, description, image_url, image_alt, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000003', 'Stone and Masonry', NULL, 'images/pages/480x320/gallery-13.jpg', 'Stone and masonry work including patios and retaining walls', 3);

INSERT INTO service_items (service_id, title, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000003', 'Patios and paving', 1),
  ('a0000000-0000-0000-0000-000000000003', 'Retaining walls', 2),
  ('a0000000-0000-0000-0000-000000000003', 'Outdoor lighting', 3),
  ('a0000000-0000-0000-0000-000000000003', 'Monument design', 4),
  ('a0000000-0000-0000-0000-000000000003', 'Installation', 5),
  ('a0000000-0000-0000-0000-000000000003', 'Cement work, sidewalks, and steps', 6);

-- Landscape
INSERT INTO services (id, title, description, image_url, image_alt, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000004', 'Landscape', NULL, 'images/pages/480x320/gallery-6.jpg', 'Landscape design with patios, firepits, and outdoor living spaces', 4);

INSERT INTO service_items (service_id, title, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000004', 'Enhancements and Designs', 1),
  ('a0000000-0000-0000-0000-000000000004', 'Patios', 2),
  ('a0000000-0000-0000-0000-000000000004', 'Rock & Mulch replenishment', 3),
  ('a0000000-0000-0000-0000-000000000004', 'Sod Installation', 4),
  ('a0000000-0000-0000-0000-000000000004', 'Flower Bed Planting & Maintenance', 5),
  ('a0000000-0000-0000-0000-000000000004', 'Seasonal potting arrangements', 6),
  ('a0000000-0000-0000-0000-000000000004', 'Outdoor entertainment living space', 7),
  ('a0000000-0000-0000-0000-000000000004', 'Firepits', 8),
  ('a0000000-0000-0000-0000-000000000004', 'Pergolas', 9),
  ('a0000000-0000-0000-0000-000000000004', 'Retaining walls', 10),
  ('a0000000-0000-0000-0000-000000000004', 'Stone walkways', 11),
  ('a0000000-0000-0000-0000-000000000004', 'Cement by design', 12),
  ('a0000000-0000-0000-0000-000000000004', 'Holiday decor & lighting', 13);

-- Snow Removal
INSERT INTO services (id, title, description, image_url, image_alt, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000005', 'Snow Removal', NULL, 'images/pages/480x320/gallery-8.jpg', 'Commercial and residential snow removal service in Minneapolis-St. Paul metro', 5);

INSERT INTO service_items (service_id, title, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000005', 'Commercial snow removal', 1),
  ('a0000000-0000-0000-0000-000000000005', 'Residential snow removal', 2),
  ('a0000000-0000-0000-0000-000000000005', 'Parking lot ice management', 3),
  ('a0000000-0000-0000-0000-000000000005', 'Sidewalk ice management', 4),
  ('a0000000-0000-0000-0000-000000000005', 'Snow Blowing & Hand Shoveling', 5),
  ('a0000000-0000-0000-0000-000000000005', 'Salt and liquid applications', 6),
  ('a0000000-0000-0000-0000-000000000005', 'Snow relocation/full removal', 7),
  ('a0000000-0000-0000-0000-000000000005', '24-hour emergency service', 8);

-- =============================================================================
-- GALLERY ITEMS
-- =============================================================================
INSERT INTO gallery_items (image_url, thumbnail_url, alt_text, title, sort_order) VALUES
(
  'images/pages/480x320/gallery-1.jpg',
  'images/pages/480x320/gallery-1.jpg',
  'Commercial lawn mowing and maintenance at apartment complex in Bloomington MN',
  'Commercial lawn mowing for apartment complex in Bloomington MN',
  1
),
(
  'images/pages/480x320/gallery-2.jpg',
  'images/pages/480x320/gallery-2.jpg',
  'Commercial roadside lawn mowing with zero-turn mower in Twin Cities MN',
  'Commercial lawn mowing along roadside in Minneapolis-St. Paul area',
  2
),
(
  'images/pages/480x320/gallery-3.jpg',
  'images/pages/480x320/gallery-3.jpg',
  'Commercial landscape bed planting and garden installation in Twin Cities metro area',
  'Commercial landscaping bed planting in progress',
  3
),
(
  'images/pages/480x320/gallery-4.jpg',
  'images/pages/480x320/gallery-4.jpg',
  'Commercial landscape bed with decorative stone mulch and shrubs in Bloomington MN',
  'Completed commercial landscape bed with stone mulch and plantings',
  4
),
(
  'images/pages/480x320/gallery-5.jpg',
  'images/pages/480x320/gallery-5.jpg',
  'Decorative fall seasonal planter with pumpkins, mums, and ornamental kale by GDL Stone Snow',
  'Seasonal fall planter arrangement',
  5
),
(
  'images/pages/480x320/gallery-6.jpg',
  'images/pages/480x320/gallery-6.jpg',
  'Winter holiday planter with evergreen branches, pine cones, and red accents by GDL Stone Snow',
  'Winter holiday planter arrangement with evergreens and pine cones',
  6
),
(
  'images/pages/480x320/gallery-7.jpg',
  'images/pages/480x320/gallery-7.jpg',
  'Sprinkler and irrigation system repair and maintenance service in Bloomington MN',
  'Irrigation system repair and maintenance',
  7
),
(
  'images/pages/480x320/gallery-8.jpg',
  'images/pages/480x320/gallery-8.jpg',
  'Commercial snow removal and ice control at apartment complex parking lot in Twin Cities MN',
  'Commercial snow removal and ice management at apartment building',
  8
),
(
  'images/pages/480x320/gallery-9.jpg',
  'images/pages/480x320/gallery-9.jpg',
  'Snow plow fleet with loader, tractor, and plows for commercial snow removal in Minneapolis-St. Paul',
  'Snow removal equipment fleet ready for winter operations',
  9
),
(
  'images/pages/480x320/gallery-10.jpg',
  'images/pages/480x320/gallery-10.jpg',
  'Residential front walkway excavation and masonry preparation by GDL Stone Snow',
  'Residential walkway and masonry project in progress',
  10
),
(
  'images/pages/480x320/gallery-11.jpg',
  'images/pages/480x320/gallery-11.jpg',
  'Custom brick and flagstone front entry steps and walkway completed by GDL Stone Snow in Twin Cities',
  'Completed brick and stone front entry steps and walkway',
  11
),
(
  'images/pages/480x320/gallery-12.jpg',
  'images/pages/480x320/gallery-12.jpg',
  'Elegant flagstone front entryway with seasonal winter planters at residential home in Bloomington MN',
  'Flagstone entryway with seasonal planters',
  12
),
(
  'images/pages/480x320/gallery-13.jpg',
  'images/pages/480x320/gallery-13.jpg',
  'Custom flagstone patio with stone retaining walls and boxwood landscaping in Twin Cities MN',
  'Custom stone patio with retaining wall and walkway',
  13
),
(
  'images/pages/480x320/gallery-14.jpg',
  'images/pages/480x320/gallery-14.jpg',
  'Residential stone patio with block retaining wall pillars and outdoor seating area by GDL Stone Snow',
  'Stone patio with seating area and retaining wall pillars',
  14
),
(
  'images/pages/480x320/gallery-15.jpg',
  'images/pages/480x320/gallery-15.jpg',
  'Commercial stone veneer retaining wall with water feature and landscaping at condominium in Bloomington MN',
  'Commercial stone retaining wall with water feature and landscaping',
  15
);

-- =============================================================================
-- PROMOTIONS & PROMOTION ITEMS
-- =============================================================================

-- Spring Deals
INSERT INTO promotions (id, title, season, image_url, image_alt, icon_class, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'SPRING DEALS', 'spring', 'images/pages/480x320/promotions-1.jpg', 'Spring landscaping deals - fertilization, mulch, flower beds, and clean-up services in Bloomington MN', 'features-flower', 1);

INSERT INTO promotion_items (promotion_id, title, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Spring fertilization-treatment', 1),
  ('b0000000-0000-0000-0000-000000000001', 'Mulch replenishment', 2),
  ('b0000000-0000-0000-0000-000000000001', 'Edging Replacement', 3),
  ('b0000000-0000-0000-0000-000000000001', 'Flower Bed planting', 4),
  ('b0000000-0000-0000-0000-000000000001', 'Potting Arrangements', 5),
  ('b0000000-0000-0000-0000-000000000001', 'Planting trees-shrubs-bushes', 6),
  ('b0000000-0000-0000-0000-000000000001', 'Re-seeding', 7),
  ('b0000000-0000-0000-0000-000000000001', 'Sod Install', 8),
  ('b0000000-0000-0000-0000-000000000001', 'Full Spring Clean-Up', 9),
  ('b0000000-0000-0000-0000-000000000001', 'Irrigation Maintenance', 10);

-- Summer Deals
INSERT INTO promotions (id, title, season, image_url, image_alt, icon_class, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'SUMMER DEALS', 'summer', 'images/pages/480x320/promotions-2.jpg', 'Summer landscaping deals - irrigation, flower install, watering, and sod services in Bloomington MN', 'features-plant', 2);

INSERT INTO promotion_items (promotion_id, title, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'Irrigation check-parts-system-timmer', 1),
  ('b0000000-0000-0000-0000-000000000002', 'Flower Install', 2),
  ('b0000000-0000-0000-0000-000000000002', 'Watering schedule-pricing', 3),
  ('b0000000-0000-0000-0000-000000000002', 'Flower Feeding-dead heading', 4),
  ('b0000000-0000-0000-0000-000000000002', 'Order fall bulbs for planting', 5),
  ('b0000000-0000-0000-0000-000000000002', 'Lock in early winter plowing pricing', 6),
  ('b0000000-0000-0000-0000-000000000002', 'Mulch replenishment', 7),
  ('b0000000-0000-0000-0000-000000000002', 'Sod Install', 8),
  ('b0000000-0000-0000-0000-000000000002', 'Planting trees-shrubs-bushes', 9),
  ('b0000000-0000-0000-0000-000000000002', 'Irrigation Maintenance', 10);

-- Fall Deals
INSERT INTO promotions (id, title, season, image_url, image_alt, icon_class, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'FALL DEALS', 'fall', 'images/pages/480x320/promotions-3.jpg', 'Fall landscaping deals - clean-up, irrigation blow-out, shrub pruning, and holiday decor in Bloomington MN', 'features-leaf', 3);

INSERT INTO promotion_items (promotion_id, title, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'Fall Clean-Up', 1),
  ('b0000000-0000-0000-0000-000000000003', 'Irrigation Shut-Down Blow-Out', 2),
  ('b0000000-0000-0000-0000-000000000003', 'Prune Shrubs', 3),
  ('b0000000-0000-0000-0000-000000000003', 'Shrub-Tree Wrapping', 4),
  ('b0000000-0000-0000-0000-000000000003', 'Plant Spring Bulbs', 5),
  ('b0000000-0000-0000-0000-000000000003', 'Mulch gardens-roses-shrubs', 6),
  ('b0000000-0000-0000-0000-000000000003', 'Flag lot-driveway for plowing', 7),
  ('b0000000-0000-0000-0000-000000000003', 'Planting trees-shrubs-bushes', 8),
  ('b0000000-0000-0000-0000-000000000003', 'Order salt-sand delivery for winter', 9),
  ('b0000000-0000-0000-0000-000000000003', 'Holiday Decor-Lights-Tree', 10);

-- =============================================================================
-- TESTIMONIALS
-- =============================================================================
INSERT INTO testimonials (quote, author_name, author_location, sort_order) VALUES
(
  'GDL Stone Snow did a terrific job. They build a beautiful monument in the backyard - they really paid attention to detail. Thank you!',
  'Stacey',
  'Edina',
  1
),
(
  'We would like to thank GDL Stone Snow for an outstanding effort on this recently completed project located in Minnetonka. The project involved a very aggressive schedule and it was completed on time.',
  'Mark',
  'Minnetonka',
  2
);

-- =============================================================================
-- CONTENT BLOCKS
-- =============================================================================

-- Who We Are (contact page)
INSERT INTO content_blocks (slug, title, body, page, sort_order) VALUES
(
  'who_we_are',
  'WHO WE ARE',
  'In 2003 Fernando Floersch, owner of GDL-Stone Snow LLC., created a united front and a shared belief that caring for our customers and team members should be the heart of the company. With consistent, excellent and proactive services, steady client focus GDL could deliver future investments everyday and everywhere with a wide range of people. He takes great pride in his family owned and operated business.',
  'contact',
  1
),
(
  'who_we_are_continued',
  NULL,
  'We have been in the landscape, lawn care and snow removal industry since 2003 and have successfully landed nationwide accounts with large corporations such as, Pinnacle Properties, Caspian Group, Sherman & Associates, Walser Corporation, and RMK Management. We take pride in providing top notch service along with industry leading principles and procedures in landscaping, design and maintenance.',
  'contact',
  2
);

-- About section (homepage)
INSERT INTO content_blocks (slug, title, body, page, sort_order) VALUES
(
  'about_company',
  'ABOUT OUR COMPANY',
  'GDL has been in the Landscape Industry since 2003, creating and mastering landscape designs throughout the Twin Cities. We take pride in providing top notch service along with industry leading principles and procedures in landscape design. Our company delivers its promise to you, our client, and values your business. The needs of your business remain our top priority for the entire period of service.',
  'home',
  1
),
(
  'reasons_to_choose_us',
  'REASONS TO CHOOSE US',
  'GDL has been in the Landscape Industry since 2003 creating and mastering landscape designs throughout the Twin Cities. We take pride in providing top notch service along with industry leading principles and procedures in landscape design.',
  'home',
  2
),
(
  'our_services_intro',
  'OUR SERVICES',
  'We provide exceptional services to a wide range of commercial and residential customers',
  'home',
  3
);

-- Mission points (homepage)
INSERT INTO content_blocks (slug, title, body, page, sort_order) VALUES
(
  'mission_point_1',
  'OUR MISSION IS TO:',
  'Offer a different kind of services to families and Business',
  'home',
  10
),
(
  'mission_point_2',
  NULL,
  'Deliver high quality and consistent services',
  'home',
  11
),
(
  'mission_point_3',
  NULL,
  'Use friendly environmental products',
  'home',
  12
),
(
  'mission_point_4',
  NULL,
  'Provide stable jobs with reasonable wages',
  'home',
  13
),
(
  'mission_point_5',
  NULL,
  'Concentrate our resources on maintaining standards',
  'home',
  14
),
(
  'mission_point_6',
  NULL,
  'Make you an extremely satisfied customer',
  'home',
  15
);

-- Contact page mission points
INSERT INTO content_blocks (slug, title, body, page, sort_order) VALUES
(
  'contact_mission_1',
  'OUR MISSION IS TO:',
  'Offer a full range of services to residential and commercial customers.',
  'contact',
  10
),
(
  'contact_mission_2',
  NULL,
  'Deliver high quality work and consistent customer service.',
  'contact',
  11
),
(
  'contact_mission_3',
  NULL,
  'Build lasting relationships with our employees, customers and community.',
  'contact',
  12
),
(
  'contact_mission_4',
  NULL,
  'Take pride in turning your vision into reality!',
  'contact',
  13
);
