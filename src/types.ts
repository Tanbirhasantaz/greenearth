/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Page = 'home' | 'about' | 'projects' | 'involved' | 'blog' | 'gallery' | 'contact' | 'admin' | 'green-hero';

export type Language = 'en' | 'bn';

export interface Project {
  id: string;
  title: string;
  titleBn: string;
  category: 'plantation' | 'renewable' | 'water' | 'waste' | 'awareness';
  categoryLabel: string;
  categoryLabelBn: string;
  location: string;
  locationBn: string;
  status: 'ongoing' | 'completed';
  statusLabel: string;
  statusLabelBn: string;
  shortDescription: string;
  shortDescriptionBn: string;
  fullDescription: string;
  fullDescriptionBn: string;
  impactMetric: string;
  impactMetricBn: string;
  impactLabel: string;
  impactLabelBn: string;
  image: string;
  gallery: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  nameBn: string;
  role: string;
  roleBn: string;
  bio: string;
  bioBn: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  excerpt: string;
  excerptBn: string;
  content: string;
  contentBn: string;
  date: string;
  dateBn: string;
  author: string;
  authorBn: string;
  readTime: string;
  readTimeBn: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  titleBn: string;
  category: 'plantation' | 'renewable' | 'water' | 'waste' | 'campaign';
  categoryLabel: string;
  categoryLabelBn: string;
  image: string;
  date: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  quoteBn: string;
  author: string;
  authorBn: string;
  role: string;
  roleBn: string;
  location: string;
  locationBn: string;
}

export interface Milestone {
  id: string;
  year: string;
  yearBn: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
}

export interface CoreValue {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  iconName: string;
}
