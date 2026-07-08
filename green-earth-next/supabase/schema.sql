-- Supabase Database Schema for Green Earth Environmental Organization

-- 1. Create Enums
CREATE TYPE project_category AS ENUM (
  'tree_plantation', 
  'renewable_energy', 
  'water_sanitation', 
  'waste_management', 
  'awareness_campaign'
);

CREATE TYPE project_status AS ENUM (
  'ongoing', 
  'completed'
);

CREATE TYPE volunteer_status AS ENUM (
  'new', 
  'contacted', 
  'active'
);

CREATE TYPE donation_method AS ENUM (
  'bkash', 
  'nagad', 
  'bank_transfer', 
  'card'
);

CREATE TYPE donation_status AS ENUM (
  'pending', 
  'confirmed'
);

CREATE TYPE media_type AS ENUM (
  'image', 
  'video'
);

-- 2. Create Tables
-- Projects Table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  category project_category NOT NULL,
  location VARCHAR(255) NOT NULL,
  location_bn VARCHAR(255),
  status project_status DEFAULT 'ongoing' NOT NULL,
  description TEXT NOT NULL,
  description_bn TEXT,
  impact_summary VARCHAR(255) NOT NULL,
  impact_summary_bn VARCHAR(255),
  cover_image_url TEXT NOT NULL,
  gallery_image_urls TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  category_bn VARCHAR(100),
  excerpt TEXT NOT NULL,
  excerpt_bn TEXT,
  content TEXT NOT NULL,
  content_bn TEXT,
  cover_image_url TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Team Members Table
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_bn VARCHAR(255),
  role VARCHAR(255) NOT NULL,
  role_bn VARCHAR(255),
  photo_url TEXT NOT NULL,
  bio TEXT NOT NULL,
  bio_bn TEXT,
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Volunteers Table (Submissions)
CREATE TABLE volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  area_of_interest VARCHAR(100) NOT NULL,
  message TEXT,
  status volunteer_status DEFAULT 'new' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Donations Table (Submissions)
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  method donation_method NOT NULL,
  status donation_status DEFAULT 'pending' NOT NULL,
  transaction_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Gallery Items Table
CREATE TABLE gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  event_name VARCHAR(255),
  event_name_bn VARCHAR(255),
  image_url TEXT NOT NULL,
  media_type media_type DEFAULT 'image' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Contact Messages Table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Site Settings Table (Key-Value Content)
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description VARCHAR(255),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Row Level Security Policies (RLS)

-- Projects Policies
CREATE POLICY "Allow public read access to projects" ON projects
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated full write to projects" ON projects
  FOR ALL TO authenticated USING (true);

-- Blog Posts Policies
CREATE POLICY "Allow public read access to blog_posts" ON blog_posts
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated full write to blog_posts" ON blog_posts
  FOR ALL TO authenticated USING (true);

-- Team Members Policies
CREATE POLICY "Allow public read access to team_members" ON team_members
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated full write to team_members" ON team_members
  FOR ALL TO authenticated USING (true);

-- Volunteers Policies
CREATE POLICY "Allow public insert to volunteers" ON volunteers
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to volunteers" ON volunteers
  FOR ALL TO authenticated USING (true);

-- Donations Policies
CREATE POLICY "Allow public insert to donations" ON donations
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to donations" ON donations
  FOR ALL TO authenticated USING (true);

-- Gallery Items Policies
CREATE POLICY "Allow public read access to gallery_items" ON gallery_items
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated full write to gallery_items" ON gallery_items
  FOR ALL TO authenticated USING (true);

-- Newsletter Subscribers Policies
CREATE POLICY "Allow public insert to newsletter_subscribers" ON newsletter_subscribers
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to newsletter_subscribers" ON newsletter_subscribers
  FOR ALL TO authenticated USING (true);

-- Contact Messages Policies
CREATE POLICY "Allow public insert to contact_messages" ON contact_messages
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to contact_messages" ON contact_messages
  FOR ALL TO authenticated USING (true);

-- Site Settings Policies
CREATE POLICY "Allow public read access to site_settings" ON site_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated full write to site_settings" ON site_settings
  FOR ALL TO authenticated USING (true);
