-- ============================================================
-- Perfect Industrial Solution — Database Schema
-- MySQL 8+ (uses utf8mb4, JSON not required, plain mysql2 driver)
-- Run this once against an empty database:
--   mysql -u <user> -p <database_name> < database/schema.sql
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- admins
-- Username-only authentication. No passwords are stored.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  display_name VARCHAR(150) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admins_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- hero_slides
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_slides (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  eyebrow VARCHAR(150) DEFAULT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) DEFAULT NULL,
  description TEXT,
  cta_text VARCHAR(100) DEFAULT NULL,
  cta_link VARCHAR(255) DEFAULT NULL,
  cta_text_2 VARCHAR(100) DEFAULT NULL,
  cta_link_2 VARCHAR(255) DEFAULT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_public_id VARCHAR(255) DEFAULT NULL,
  status TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_hero_status (status),
  KEY idx_hero_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- about_sections (singleton — one row holds the About Us content)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS about_sections (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) DEFAULT NULL,
  heading VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) DEFAULT NULL,
  image_public_id VARCHAR(255) DEFAULT NULL,
  cta_text VARCHAR(100) DEFAULT NULL,
  cta_link VARCHAR(255) DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- about_features (the 4 highlight cards under About Us)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS about_features (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description VARCHAR(500) DEFAULT NULL,
  icon VARCHAR(100) DEFAULT 'ShieldCheck',
  status TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_about_features_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- product_categories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  description VARCHAR(500) DEFAULT NULL,
  status TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categories_slug (slug),
  KEY idx_categories_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- products
-- features / specifications / applications are stored as
-- newline-separated plain text (kept simple by design).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED DEFAULT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  short_description VARCHAR(500) DEFAULT NULL,
  description TEXT,
  features TEXT,
  specifications TEXT,
  applications TEXT,
  main_image_url VARCHAR(500) DEFAULT NULL,
  main_image_public_id VARCHAR(255) DEFAULT NULL,
  status TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_status (status),
  KEY idx_products_category (category_id),
  KEY idx_products_created (created_at),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id)
    REFERENCES product_categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- product_images (gallery images per product)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_public_id VARCHAR(255) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_product_images_product (product_id),
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- product_inquiries
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_inquiries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED DEFAULT NULL,
  product_name_snapshot VARCHAR(200) DEFAULT NULL,
  customer_name VARCHAR(150) NOT NULL,
  company_name VARCHAR(150) DEFAULT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  quantity VARCHAR(60) DEFAULT NULL,
  message TEXT NOT NULL,
  status ENUM('New','Contacted','In Progress','Converted','Closed') NOT NULL DEFAULT 'New',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_inquiries_status (status),
  KEY idx_inquiries_created (created_at),
  KEY idx_inquiries_product (product_id),
  CONSTRAINT fk_inquiries_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- contact_messages
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  company VARCHAR(150) DEFAULT NULL,
  subject VARCHAR(200) DEFAULT NULL,
  message TEXT NOT NULL,
  status ENUM('New','Contacted','In Progress','Converted','Closed') NOT NULL DEFAULT 'New',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_contact_status (status),
  KEY idx_contact_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- gallery
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) DEFAULT NULL,
  description VARCHAR(500) DEFAULT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_public_id VARCHAR(255) DEFAULT NULL,
  status TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_gallery_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- testimonials
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  designation VARCHAR(150) DEFAULT NULL,
  company VARCHAR(150) DEFAULT NULL,
  review TEXT NOT NULL,
  rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
  photo_url VARCHAR(500) DEFAULT NULL,
  photo_public_id VARCHAR(255) DEFAULT NULL,
  status TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_testimonials_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- trusted_clients
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trusted_clients (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(150) NOT NULL,
  logo_url VARCHAR(500) NOT NULL,
  logo_public_id VARCHAR(255) DEFAULT NULL,
  website VARCHAR(255) DEFAULT NULL,
  status TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_clients_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- blog_posts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  excerpt VARCHAR(500) DEFAULT NULL,
  content TEXT NOT NULL,
  featured_image_url VARCHAR(500) DEFAULT NULL,
  featured_image_public_id VARCHAR(255) DEFAULT NULL,
  author VARCHAR(150) DEFAULT NULL,
  status TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_blog_posts_slug (slug),
  KEY idx_blog_posts_status (status),
  KEY idx_blog_posts_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- company_settings (singleton — one row holds global site config)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(200) NOT NULL DEFAULT 'Perfect Industrial Solution',
  logo_url VARCHAR(500) DEFAULT NULL,
  logo_public_id VARCHAR(255) DEFAULT NULL,
  email VARCHAR(190) DEFAULT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  whatsapp VARCHAR(40) DEFAULT NULL,
  address VARCHAR(500) DEFAULT NULL,
  google_maps_url VARCHAR(500) DEFAULT NULL,
  working_hours VARCHAR(200) DEFAULT NULL,
  facebook VARCHAR(255) DEFAULT NULL,
  instagram VARCHAR(255) DEFAULT NULL,
  linkedin VARCHAR(255) DEFAULT NULL,
  youtube VARCHAR(255) DEFAULT NULL,
  footer_description VARCHAR(500) DEFAULT NULL,
  years_experience VARCHAR(20) DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Seed / demo data
-- Editable placeholder content only — no fabricated claims,
-- clients, or certifications. Replace via the admin panel.
-- ============================================================

INSERT INTO admins (username, display_name) VALUES ('admin', 'Site Administrator')
  ON DUPLICATE KEY UPDATE username = username;

INSERT INTO company_settings (
  company_name, logo_url, email, phone, whatsapp, address,
  google_maps_url, working_hours, facebook, instagram, linkedin, youtube,
  footer_description, years_experience
) SELECT * FROM (SELECT
  'Perfect Industrial Solution' AS company_name,
  NULL AS logo_url,
  'info@perfectindustrialsolution.com' AS email,
  '+91 98765 43210' AS phone,
  '+91 98765 43210' AS whatsapp,
  '123, Industrial Area, Gurgaon, Haryana - 122001' AS address,
  'https://maps.google.com' AS google_maps_url,
  'Mon - Sat: 9:00 AM - 6:00 PM' AS working_hours,
  '' AS facebook, '' AS instagram, '' AS linkedin, '' AS youtube,
  'We provide complete industrial solutions with a wide range of quality products and reliable services to meet the needs of modern industries.' AS footer_description,
  '20+' AS years_experience
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM company_settings);

INSERT INTO about_sections (label, heading, description, cta_text, cta_link)
SELECT * FROM (SELECT
  'ABOUT US' AS label,
  'Your Trusted Partner In Industrial Solutions' AS heading,
  'Perfect Industrial Solution is a provider of industrial products and services. With a focus on quality, reliability and customer satisfaction, we aim to help industries run better and achieve more.' AS description,
  'Know More About Us' AS cta_text,
  '/about-us' AS cta_link
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM about_sections);

INSERT INTO about_features (title, description, icon, sort_order) VALUES
('Premium Quality', 'We deliver only high-quality products that ensure long-lasting performance.', 'Award', 1),
('Wide Range', 'A comprehensive range of industrial products for diverse applications.', 'Boxes', 2),
('Expert Support', 'Our experienced team is always ready to support your needs.', 'Headset', 3),
('Customer Focused', 'We prioritize customer satisfaction through reliable service and solutions.', 'Handshake', 4);

INSERT INTO hero_slides (eyebrow, title, subtitle, description, cta_text, cta_link, cta_text_2, cta_link_2, image_url, status, sort_order) VALUES
('WELCOME TO PERFECT INDUSTRIAL SOLUTION', 'COMPLETE SOLUTION', 'FOR EVERY INDUSTRY', 'We provide high-quality industrial products and solutions designed for reliability, performance and long-term value.', 'Our Products', '/products', 'Contact Us', '/contact-us', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1920&auto=format&fit=crop', 1, 1),
('BUILT FOR INDUSTRY', 'RELIABLE PRODUCTS', 'ENGINEERED TO PERFORM', 'From pipes and fittings to valves and gaskets, we supply components that keep your operations running safely and efficiently.', 'Explore Products', '/products', 'Get A Quote', '/contact-us', 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=1920&auto=format&fit=crop', 1, 2),
('QUALITY YOU CAN TRUST', 'PARTNERING WITH', 'INDUSTRIES NATIONWIDE', 'We support oil & gas, chemical, power, water treatment, pharmaceutical and manufacturing industries with dependable solutions.', 'Our Industries', '/about-us', 'Contact Us', '/contact-us', 'https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=1920&auto=format&fit=crop', 1, 3);

INSERT INTO product_categories (name, slug, description, sort_order) VALUES
('Pipe & Pipe Fittings', 'pipe-and-pipe-fittings', 'High-quality pipes and fittings for various industrial applications.', 1),
('Flanges', 'flanges', 'Available in different sizes and standards for secure connections.', 2),
('Valves', 'valves', 'Industrial valves for flow control and pressure management.', 3),
('Gaskets', 'gaskets', 'Durable gaskets for reliable sealing in critical applications.', 4),
('Industrial Hose', 'industrial-hose', 'High-performance hoses for fluid transfer in demanding environments.', 5),
('Fasteners', 'fasteners', 'Wide range of fasteners for industrial and structural applications.', 6);

INSERT INTO products (category_id, name, slug, short_description, description, features, specifications, applications, main_image_url, sort_order) VALUES
(1, 'Carbon Steel Pipe Elbow', 'carbon-steel-pipe-elbow', 'High-quality pipe elbow for secure and durable pipeline connections.', 'Our carbon steel pipe elbows are manufactured to change the direction of flow within a piping system while maintaining structural integrity under industrial operating conditions.', 'Seamless and welded construction available\nHigh pressure and temperature resistance\nAvailable in 45° and 90° configurations\nCorrosion-resistant coating options', 'Material: Carbon Steel\nStandard: ASME B16.9\nSize Range: 1/2" to 48"\nConnection: Butt Weld', 'Oil & gas pipelines\nChemical processing plants\nPower generation facilities\nWater treatment systems', 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?q=80&w=800&auto=format&fit=crop', 1),
(2, 'Stainless Steel Flange', 'stainless-steel-flange', 'Precision-engineered flanges for secure, leak-proof pipe connections.', 'Manufactured from high-grade stainless steel, these flanges provide reliable connections between pipes, valves and other equipment across a range of pressure classes.', 'High corrosion resistance\nPrecision machined sealing face\nAvailable in multiple pressure classes\nEasy installation and maintenance', 'Material: Stainless Steel 304/316\nStandard: ASME B16.5\nPressure Class: 150# to 2500#\nType: Weld Neck / Slip-On / Blind', 'Petrochemical plants\nPharmaceutical manufacturing\nFood processing\nMarine applications', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop', 1),
(3, 'Industrial Gate Valve', 'industrial-gate-valve', 'Heavy-duty gate valve for reliable on/off flow control.', 'Designed for full-bore, unobstructed flow, our gate valves provide dependable isolation for pipelines carrying liquids, gases and steam.', 'Bi-directional flow control\nLow pressure drop when fully open\nRugged bronze or steel body\nRising and non-rising stem options', 'Material: Cast Steel / Bronze\nStandard: API 600\nSize Range: 2" to 24"\nEnd Connection: Flanged / Threaded', 'Water distribution networks\nOil & gas transmission lines\nPower plants\nIndustrial process piping', 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=800&auto=format&fit=crop', 1),
(4, 'Rubber Sealing Gasket', 'rubber-sealing-gasket', 'Durable rubber gaskets engineered for dependable sealing performance.', 'Our rubber gaskets are compounded to withstand demanding industrial conditions while maintaining a tight, long-lasting seal between mating flange surfaces.', 'Excellent chemical and heat resistance\nCustom shapes and thicknesses available\nCompression-set resistant compound\nSuitable for high-pressure applications', 'Material: EPDM / NBR / Viton\nThickness: 1mm to 10mm\nTemperature Range: -40°C to 200°C\nStandard: ASME B16.21', 'Flange sealing\nPump and valve sealing\nHVAC systems\nChemical processing equipment', 'https://images.unsplash.com/photo-1581092918484-8313ade2d9b6?q=80&w=800&auto=format&fit=crop', 1),
(5, 'Heavy-Duty Industrial Hose', 'heavy-duty-industrial-hose', 'Flexible, abrasion-resistant hose built for demanding fluid transfer.', 'Constructed with reinforced layers, this hose is designed to safely transfer fluids, chemicals and air in tough industrial environments.', 'Reinforced multi-layer construction\nHigh abrasion and weather resistance\nFlexible for easy routing\nAvailable in multiple diameters and lengths', 'Material: Rubber / PVC / Composite\nWorking Pressure: Up to 300 PSI\nTemperature Range: -20°C to 120°C\nSize Range: 1/2" to 6"', 'Chemical transfer\nCompressed air lines\nWater discharge\nOil & fuel handling', 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=800&auto=format&fit=crop', 1),
(6, 'High-Tensile Hex Bolt Set', 'high-tensile-hex-bolt-set', 'Precision-manufactured fasteners for demanding structural applications.', 'Our high-tensile hex bolts, nuts and washers are manufactured to strict tolerances for dependable structural and mechanical fastening.', 'High tensile strength grade\nCorrosion-resistant plating\nConsistent thread precision\nAvailable in multiple grades and finishes', 'Material: Alloy Steel\nGrade: 8.8 / 10.9 / 12.9\nStandard: ISO 4014 / DIN 931\nFinish: Zinc Plated / Hot-Dip Galvanized', 'Structural steel construction\nMachinery assembly\nPipeline flange connections\nEquipment mounting', 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?q=80&w=800&auto=format&fit=crop', 1);

INSERT INTO gallery (title, description, image_url, sort_order) VALUES
('Manufacturing Facility', 'A look inside our production and quality control process.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop', 1),
('Product Inventory', 'Organized inventory ensuring fast order fulfillment.', 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop', 2),
('Quality Inspection', 'Every batch is inspected before it leaves our facility.', 'https://images.unsplash.com/photo-1581091012184-7f5e5b3c6a1a?q=80&w=800&auto=format&fit=crop', 3);

INSERT INTO testimonials (customer_name, designation, company, review, rating, sort_order) VALUES
('Demo Client', 'Procurement Manager', 'Sample Oil & Gas Company', 'This is placeholder testimonial content — replace with a real customer review from the admin panel.', 5, 1),
('Demo Client', 'Plant Head', 'Sample Chemical Industry', 'This is placeholder testimonial content — replace with a real customer review from the admin panel.', 5, 2),
('Demo Client', 'Purchase Manager', 'Sample Manufacturing Unit', 'This is placeholder testimonial content — replace with a real customer review from the admin panel.', 5, 3);

INSERT INTO blog_posts (title, slug, excerpt, content, featured_image_url, author, status) VALUES
('How To Choose The Right Industrial Valve For Your Application', 'how-to-choose-the-right-industrial-valve', 'A quick placeholder guide to selecting valves — replace with your own article from the admin panel.', 'This is placeholder blog content. Use the admin panel to replace it with a real article covering how factors like pressure rating, media compatibility and end connections affect valve selection for industrial piping systems.\n\nReplace this paragraph with your own expert content once ready.', 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=1200&auto=format&fit=crop', 'Perfect Industrial Solution', 1),
('5 Signs Your Pipe Fittings Need Replacement', '5-signs-your-pipe-fittings-need-replacement', 'A quick placeholder checklist — replace with your own article from the admin panel.', 'This is placeholder blog content. Use the admin panel to replace it with a real article covering common warning signs of wear in industrial pipe fittings, such as corrosion, leaks and pressure loss.\n\nReplace this paragraph with your own expert content once ready.', 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?q=80&w=1200&auto=format&fit=crop', 'Perfect Industrial Solution', 1);
