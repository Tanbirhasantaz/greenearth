// Shared TypeScript Types for Green Earth (Bangladesh) Next.js 14 + Supabase

export type ProjectCategory = 
  | 'tree_plantation' 
  | 'renewable_energy' 
  | 'water_sanitation' 
  | 'waste_management' 
  | 'awareness_campaign';

export type ProjectStatus = 'ongoing' | 'completed';

export interface Project {
  id: string;
  title: string;
  title_bn: string;
  slug: string;
  category: ProjectCategory;
  location: string;
  location_bn: string;
  status: ProjectStatus;
  description: string;
  description_bn: string;
  impact_summary: string;
  impact_summary_bn: string;
  cover_image_url: string;
  gallery_image_urls: string[];
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  title_bn: string;
  slug: string;
  category: string;
  category_bn: string;
  excerpt: string;
  excerpt_bn: string;
  content: string;
  content_bn: string;
  cover_image_url: string;
  published_at: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  name_bn: string;
  role: string;
  role_bn: string;
  photo_url: string;
  bio: string;
  bio_bn: string;
  display_order: number;
  created_at: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  area_of_interest: string;
  message?: string;
  status: 'new' | 'contacted' | 'active';
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  email: string;
  amount: number;
  method: 'bkash' | 'nagad' | 'bank_transfer' | 'card';
  status: 'pending' | 'confirmed';
  transaction_id?: string;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  title_bn: string;
  event_name?: string;
  event_name_bn?: string;
  image_url: string;
  media_type: 'image' | 'video';
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  updated_at: string;
}
