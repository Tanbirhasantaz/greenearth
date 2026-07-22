/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PROJECTS, BLOG_POSTS, TEAM_MEMBERS, GALLERY_ITEMS, TESTIMONIALS, MILESTONES, CORE_VALUES } from './data';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Helper to initialize local storage databases if not already present
export const initStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem('ge_db_projects')) {
    localStorage.setItem('ge_db_projects', JSON.stringify(PROJECTS));
  }
  if (!localStorage.getItem('ge_db_blogs')) {
    localStorage.setItem('ge_db_blogs', JSON.stringify(BLOG_POSTS));
  }
  if (!localStorage.getItem('ge_db_team')) {
    localStorage.setItem('ge_db_team', JSON.stringify(TEAM_MEMBERS));
  }
  if (!localStorage.getItem('ge_db_gallery')) {
    localStorage.setItem('ge_db_gallery', JSON.stringify(GALLERY_ITEMS));
  }
  if (!localStorage.getItem('ge_db_testimonials')) {
    localStorage.setItem('ge_db_testimonials', JSON.stringify(TESTIMONIALS));
  }
  if (!localStorage.getItem('ge_db_volunteers')) {
    localStorage.setItem('ge_db_volunteers', JSON.stringify([]));
  }
  if (!localStorage.getItem('ge_db_donations')) {
    localStorage.setItem('ge_db_donations', JSON.stringify([]));
  }
  if (!localStorage.getItem('ge_db_subscribers')) {
    localStorage.setItem('ge_db_subscribers', JSON.stringify([]));
  }
  if (!localStorage.getItem('ge_db_contacts')) {
    localStorage.setItem('ge_db_contacts', JSON.stringify([]));
  }
  if (!localStorage.getItem('ge_db_settings')) {
    localStorage.setItem('ge_db_settings', JSON.stringify({
      orgName: 'Green Earth',
      tagline: 'For a Sustainable Bangladesh',
      taglineBn: 'সবুজ বাংলাদেশের জন্য',
      phone: '+880 1712-345678',
      email: 'info@greenearth.org',
      address: 'House 42, Road 11, Dhanmondi, Dhaka',
      membershipFormUrl: 'https://forms.gle/51Kt57CfRuAnAGy88'
    }));
  }
  if (!localStorage.getItem('ge_db_milestones') || localStorage.getItem('ge_db_milestones') === '[]') {
    localStorage.setItem('ge_db_milestones', JSON.stringify(MILESTONES));
  }
  if (!localStorage.getItem('ge_db_corevalues') || localStorage.getItem('ge_db_corevalues') === '[]') {
    localStorage.setItem('ge_db_corevalues', JSON.stringify(CORE_VALUES));
  }
  if (!localStorage.getItem('ge_db_focusareas')) {
    const defaultFocusAreas = [
      {
        id: "focus-1",
        iconName: "Trees",
        title: "Tree Plantation",
        titleBn: "বৃক্ষরোপণ কর্মসূচি",
        description: "Planting native trees and coastal mangroves in erosion-prone belts of Sundarbans and northern riverbanks.",
        descriptionBn: "সুন্দরবন উপকূল এবং উত্তরাঞ্চলের নদীভাঙন কবলিত এলাকায় দেশীয় চারা রোপণ ও ম্যানগ্রোভ বনায়ন তৈরি করা।",
        color: "emerald"
      },
      {
        id: "focus-2",
        iconName: "Sun",
        title: "Renewable Energy",
        titleBn: "নবায়নযোগ্য জ্বালানি",
        description: "Sponsoring reliable off-grid solar micro-grids for isolated schools and homes in northern river chars.",
        descriptionBn: "চরাঞ্চলের গ্রিডহীন প্রত্যন্ত এলাকায় সৌর প্যানেল ও হোম সিস্টেমের মাধ্যমে বিদ্যুৎ ও আলোর ব্যবস্থা করা।",
        color: "amber"
      },
      {
        id: "focus-3",
        iconName: "Droplet",
        title: "Water Conservation",
        titleBn: "বিশুদ্ধ পানি সরবরাহ",
        description: "Drilling deep, arsenic-free tube wells and setting rainwater purification structures in contaminated hubs.",
        descriptionBn: "আর্সেনিক ও স্যালাইন কবলিত এলাকায় গভীর বিশুদ্ধ নলকূপ এবং বৃষ্টির পানি ফিল্টারিং প্ল্যান্ট স্থাপন করা।",
        color: "sky"
      },
      {
        id: "focus-4",
        iconName: "Trash2",
        title: "Waste & Recycling",
        titleBn: "বর্জ্য ও রিসাইক্লিং",
        description: "Organizing riverbank plastic cleanups and teaching households smart eco-friendly recycling habits.",
        descriptionBn: "বুড়িগঙ্গাসহ বিভিন্ন নদী তীরবর্তী প্লাস্টিক অপসারণ এবং বাসাবাড়ির রিসাইক্লিং অভ্যাসের প্রশিক্ষণ দেওয়া।",
        color: "purple"
      }
    ];
    localStorage.setItem('ge_db_focusareas', JSON.stringify(defaultFocusAreas));
  }
};

// Cloud helper read/write methods to synchronize data globally on client-only hosts like Vercel
async function cloudRead<T>(filename: string, localStorageKey: string, defaultValue: T): Promise<T> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('key_value_store')
        .select('value')
        .eq('key', filename)
        .maybeSingle();
      if (!error && data && data.value) {
        // Synchronize local storage cache
        localStorage.setItem(localStorageKey, JSON.stringify(data.value));
        return data.value as T;
      } else if (error) {
        console.warn(`[Client CloudSync] Supabase read error for ${filename}:`, error.message);
      }
    } catch (err) {
      console.error(`[Client CloudSync] Error reading ${filename} from Supabase:`, err);
    }
  }
  // Fallback to localStorage
  const localData = localStorage.getItem(localStorageKey);
  return localData ? JSON.parse(localData) as T : defaultValue;
}

async function cloudWrite<T>(filename: string, localStorageKey: string, data: T): Promise<void> {
  // Update local cache first for optimistic responsiveness
  localStorage.setItem(localStorageKey, JSON.stringify(data));
  
  if (supabase) {
    try {
      const { error } = await supabase
        .from('key_value_store')
        .upsert({ key: filename, value: data, updated_at: new Date().toISOString() });
      if (error) {
        console.error(`[Client CloudSync] Error writing ${filename} to Supabase:`, error.message);
      } else {
        console.log(`[Client CloudSync] Successfully wrote ${filename} to Supabase.`);
      }
    } catch (err) {
      console.error(`[Client CloudSync] Error writing ${filename} to Supabase:`, err);
    }
  }
}

// Handle fallback responses locally with cloud-sync synchronization
async function handleFallback(url: string, init?: RequestInit): Promise<Response> {
  initStorage();

  const parsedUrl = new URL(url, window.location.origin);
  const path = parsedUrl.pathname;
  const method = init?.method?.toUpperCase() || 'GET';
  
  let body: any = null;
  if (init?.body) {
    try {
      body = JSON.parse(init.body as string);
    } catch {
      body = null;
    }
  }

  let status = 200;
  let responseData: any = null;

  // 1. Admin login fallback
  if (path === '/api/admin/login' && method === 'POST') {
    const { username, email, password } = body || {};
    const settings = await cloudRead<any>('settings.json', 'ge_db_settings', {});
    const storedPassword = settings?.password || 'greenearth2026';
    const identifier = (username || email || '').trim().toLowerCase();
    if ((identifier === 'admin' || identifier === 'greenearthbd.25@gmail.com') && password === storedPassword) {
      responseData = { success: true, token: 'demo-token-client-2026' };
    } else {
      status = 401;
      responseData = { success: false, error: 'Invalid username or password' };
    }
  }
  
  // 2. Settings fallback
  else if (path === '/api/settings') {
    if (method === 'GET') {
      responseData = await cloudRead<any>('settings.json', 'ge_db_settings', {});
    } else if (method === 'POST') {
      const current = await cloudRead<any>('settings.json', 'ge_db_settings', {});
      const updated = { ...current, ...body };
      await cloudWrite('settings.json', 'ge_db_settings', updated);
      if (body?.password) {
        localStorage.setItem('green-earth-admin-password', body.password);
      }
      responseData = { success: true, settings: updated };
    }
  }
  
  // 3. Projects fallback
  else if (path === '/api/projects' || path.startsWith('/api/projects/')) {
    const id = path.split('/').pop();
    const projects = await cloudRead<any[]>('projects.json', 'ge_db_projects', PROJECTS);
    
    if (method === 'GET') {
      responseData = projects;
    } else if (method === 'POST') {
      const newProject = body;
      if (newProject?.id) {
        const idx = projects.findIndex((p: any) => p.id === newProject.id);
        if (idx !== -1) projects[idx] = newProject;
        else projects.unshift(newProject);
      } else {
        newProject.id = 'proj-' + Date.now();
        projects.unshift(newProject);
      }
      await cloudWrite('projects.json', 'ge_db_projects', projects);
      responseData = { success: true, project: newProject };
    } else if (method === 'DELETE' && id && id !== 'projects') {
      const updated = projects.filter((p: any) => p.id !== id);
      await cloudWrite('projects.json', 'ge_db_projects', updated);
      responseData = { success: true };
    }
  }
  
  // 4. Blogs fallback
  else if (path === '/api/blogs' || path.startsWith('/api/blogs/')) {
    const id = path.split('/').pop();
    const blogs = await cloudRead<any[]>('blogs.json', 'ge_db_blogs', BLOG_POSTS);
    
    if (method === 'GET') {
      responseData = blogs;
    } else if (method === 'POST') {
      const newBlog = body;
      if (newBlog?.id) {
        const idx = blogs.findIndex((b: any) => b.id === newBlog.id);
        if (idx !== -1) blogs[idx] = newBlog;
        else blogs.unshift(newBlog);
      } else {
        newBlog.id = 'blog-' + Date.now();
        newBlog.date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        newBlog.dateBn = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
        blogs.unshift(newBlog);
      }
      await cloudWrite('blogs.json', 'ge_db_blogs', blogs);
      responseData = { success: true, blog: newBlog };
    } else if (method === 'DELETE' && id && id !== 'blogs') {
      const updated = blogs.filter((b: any) => b.id !== id);
      await cloudWrite('blogs.json', 'ge_db_blogs', updated);
      responseData = { success: true };
    }
  }
  
  // 5. Team fallback
  else if (path === '/api/team' || path.startsWith('/api/team/')) {
    const id = path.split('/').pop();
    const team = await cloudRead<any[]>('team.json', 'ge_db_team', TEAM_MEMBERS);
    
    if (method === 'GET') {
      responseData = team;
    } else if (method === 'POST') {
      const newMember = body;
      if (newMember?.id) {
        const idx = team.findIndex((t: any) => t.id === newMember.id);
        if (idx !== -1) team[idx] = newMember;
        else team.push(newMember);
      } else {
        newMember.id = 'team-' + Date.now();
        team.push(newMember);
      }
      await cloudWrite('team.json', 'ge_db_team', team);
      responseData = { success: true, teamMember: newMember };
    } else if (method === 'DELETE' && id && id !== 'team') {
      const updated = team.filter((t: any) => t.id !== id);
      await cloudWrite('team.json', 'ge_db_team', updated);
      responseData = { success: true };
    }
  }
  
  // 6. Gallery fallback
  else if (path === '/api/gallery' || path.startsWith('/api/gallery/')) {
    const id = path.split('/').pop();
    const gallery = await cloudRead<any[]>('gallery.json', 'ge_db_gallery', GALLERY_ITEMS);
    
    if (method === 'GET') {
      responseData = gallery;
    } else if (method === 'POST') {
      const newItem = body;
      if (newItem?.id) {
        const idx = gallery.findIndex((g: any) => g.id === newItem.id);
        if (idx !== -1) gallery[idx] = newItem;
        else gallery.push(newItem);
      } else {
        newItem.id = 'gal-' + Date.now();
        gallery.unshift(newItem);
      }
      await cloudWrite('gallery.json', 'ge_db_gallery', gallery);
      responseData = { success: true, galleryItem: newItem };
    } else if (method === 'DELETE' && id && id !== 'gallery') {
      const updated = gallery.filter((g: any) => g.id !== id);
      await cloudWrite('gallery.json', 'ge_db_gallery', updated);
      responseData = { success: true };
    }
  }
  
  // 7. Volunteers fallback
  else if (path === '/api/volunteers' || path.startsWith('/api/volunteers/')) {
    const id = path.split('/').pop();
    const volunteers = await cloudRead<any[]>('volunteers.json', 'ge_db_volunteers', []);
    
    if (method === 'GET') {
      responseData = volunteers;
    } else if (method === 'POST') {
      const volunteer = {
        ...body,
        id: body?.id || 'vol-' + Date.now(),
        date: body?.date || new Date().toISOString()
      };
      const idx = volunteers.findIndex((v: any) => v.id === volunteer.id);
      if (idx !== -1) {
        volunteers[idx] = volunteer;
      } else {
        volunteers.unshift(volunteer);
      }
      await cloudWrite('volunteers.json', 'ge_db_volunteers', volunteers);
      responseData = { success: true, volunteer };
    } else if (method === 'DELETE' && id && id !== 'volunteers') {
      const updated = volunteers.filter((v: any) => v.id !== id);
      await cloudWrite('volunteers.json', 'ge_db_volunteers', updated);
      responseData = { success: true };
    }
  }
  
  // 8. Donations fallback
  else if (path === '/api/donations' || path.startsWith('/api/donations/')) {
    const id = path.split('/').pop();
    const donations = await cloudRead<any[]>('donations.json', 'ge_db_donations', []);
    
    if (method === 'GET') {
      responseData = donations;
    } else if (method === 'POST') {
      const donation = {
        ...body,
        id: body?.id || 'don-' + Date.now(),
        date: body?.date || new Date().toISOString()
      };
      const idx = donations.findIndex((d: any) => d.id === donation.id);
      if (idx !== -1) {
        donations[idx] = donation;
      } else {
        donations.unshift(donation);
      }
      await cloudWrite('donations.json', 'ge_db_donations', donations);
      responseData = { success: true, donation };
    } else if (method === 'DELETE' && id && id !== 'donations') {
      const updated = donations.filter((d: any) => d.id !== id);
      await cloudWrite('donations.json', 'ge_db_donations', updated);
      responseData = { success: true };
    }
  }
  
  // 9. Subscribers fallback
  else if (path === '/api/subscribers') {
    const rawSubs = await cloudRead<any[]>('subscribers.json', 'ge_db_subscribers', []);
    const extractEmailStr = (item: any): string => {
      if (!item) return '';
      let curr = item;
      while (curr && typeof curr === 'object') {
        if (curr.email) curr = curr.email;
        else break;
      }
      return typeof curr === 'string' ? curr.trim() : '';
    };

    if (method === 'GET') {
      const cleanMap = new Map<string, { email: string; date: string }>();
      for (const s of (Array.isArray(rawSubs) ? rawSubs : [])) {
        const email = extractEmailStr(s);
        if (email && email.includes('@')) {
          const key = email.toLowerCase();
          if (!cleanMap.has(key)) {
            let date = '';
            let curr = s;
            while (curr && typeof curr === 'object') {
              if (curr.date && (typeof curr.date === 'string' || typeof curr.date === 'number')) {
                date = String(curr.date);
              }
              curr = curr.email;
            }
            cleanMap.set(key, { email, date: date || new Date().toISOString().split('T')[0] });
          }
        }
      }
      responseData = Array.from(cleanMap.values());
    } else if (method === 'POST') {
      const targetEmail = extractEmailStr(body?.email || body);
      if (targetEmail && targetEmail.includes('@')) {
        const list = Array.isArray(rawSubs) ? rawSubs : [];
        if (!list.some((s: any) => extractEmailStr(s).toLowerCase() === targetEmail.toLowerCase())) {
          list.unshift({ email: targetEmail, date: new Date().toISOString().split('T')[0] });
          await cloudWrite('subscribers.json', 'ge_db_subscribers', list);
        }
      }
      responseData = { success: true };
    } else if (method === 'DELETE') {
      const targetEmail = extractEmailStr(body?.email || body);
      const list = Array.isArray(rawSubs) ? rawSubs : [];
      const updated = list.filter((s: any) => extractEmailStr(s).toLowerCase() !== targetEmail.toLowerCase());
      await cloudWrite('subscribers.json', 'ge_db_subscribers', updated);
      responseData = { success: true };
    }
  }
  
  // Testimonials fallback
  else if (path === '/api/testimonials' || path.startsWith('/api/testimonials/')) {
    const parts = path.split('/');
    const id = parts.pop();
    const testimonials = await cloudRead<any[]>('testimonials.json', 'ge_db_testimonials', TESTIMONIALS);

    if (method === 'GET') {
      responseData = testimonials;
    } else if (method === 'POST') {
      const newTestimonial = {
        ...body,
        id: body?.id || 'test-' + Date.now()
      };
      testimonials.push(newTestimonial);
      await cloudWrite('testimonials.json', 'ge_db_testimonials', testimonials);
      responseData = { success: true, testimonial: newTestimonial };
    } else if (method === 'PUT' && id && id !== 'testimonials') {
      const index = testimonials.findIndex((t: any) => t.id === id);
      if (index !== -1) {
        testimonials[index] = { ...testimonials[index], ...body };
        await cloudWrite('testimonials.json', 'ge_db_testimonials', testimonials);
        responseData = { success: true, testimonial: testimonials[index] };
      } else {
        status = 404;
        responseData = { success: false, error: 'Testimonial not found' };
      }
    } else if (method === 'DELETE' && id && id !== 'testimonials') {
      const updated = testimonials.filter((t: any) => t.id !== id);
      await cloudWrite('testimonials.json', 'ge_db_testimonials', updated);
      responseData = { success: true };
    }
  }
  
  // 10. Contacts fallback
  else if (path === '/api/contacts' || path.startsWith('/api/contacts/')) {
    const id = path.split('/').pop();
    const contacts = await cloudRead<any[]>('contacts.json', 'ge_db_contacts', []);
    
    if (method === 'GET') {
      responseData = contacts;
    } else if (method === 'POST') {
      const newContact = {
        ...body,
        id: body?.id || 'contact-' + Date.now(),
        date: body?.date || new Date().toISOString()
      };
      const idx = contacts.findIndex((c: any) => c.id === newContact.id);
      if (idx !== -1) {
        contacts[idx] = newContact;
      } else {
        contacts.unshift(newContact);
      }
      await cloudWrite('contacts.json', 'ge_db_contacts', contacts);
      responseData = { success: true, contact: newContact };
    } else if (method === 'DELETE' && id && id !== 'contacts') {
      const updated = contacts.filter((c: any) => c.id !== id);
      await cloudWrite('contacts.json', 'ge_db_contacts', updated);
      responseData = { success: true };
    }
  }

  // 11. Milestones fallback
  else if (path === '/api/milestones' || path.startsWith('/api/milestones/')) {
    const id = path.split('/').pop();
    const queryId = parsedUrl.searchParams.get('id');
    const targetId = id && id !== 'milestones' ? id : queryId;
    const milestones = await cloudRead<any[]>('milestones.json', 'ge_db_milestones', MILESTONES);

    if (method === 'GET') {
      responseData = milestones;
    } else if (method === 'POST') {
      const newMilestone = body;
      if (newMilestone?.id || targetId) {
        const editId = newMilestone?.id || targetId;
        const idx = milestones.findIndex((m: any) => m.id === editId);
        if (idx !== -1) milestones[idx] = { ...milestones[idx], ...newMilestone, id: editId };
        else milestones.unshift({ ...newMilestone, id: editId });
      } else {
        newMilestone.id = 'mile-' + Date.now();
        milestones.push(newMilestone);
      }
      await cloudWrite('milestones.json', 'ge_db_milestones', milestones);
      responseData = { success: true, milestone: newMilestone };
    } else if (method === 'DELETE' && targetId) {
      const updated = milestones.filter((m: any) => m.id !== targetId);
      await cloudWrite('milestones.json', 'ge_db_milestones', updated);
      responseData = { success: true };
    }
  }

  // 12. Core Values fallback
  else if (path === '/api/corevalues' || path.startsWith('/api/corevalues/')) {
    const id = path.split('/').pop();
    const queryId = parsedUrl.searchParams.get('id');
    const targetId = id && id !== 'corevalues' ? id : queryId;
    const corevalues = await cloudRead<any[]>('corevalues.json', 'ge_db_corevalues', CORE_VALUES);

    if (method === 'GET') {
      responseData = corevalues;
    } else if (method === 'POST') {
      const newValue = body;
      if (newValue?.id || targetId) {
        const editId = newValue?.id || targetId;
        const idx = corevalues.findIndex((v: any) => v.id === editId);
        if (idx !== -1) corevalues[idx] = { ...corevalues[idx], ...newValue, id: editId };
        else corevalues.push({ ...newValue, id: editId });
      } else {
        newValue.id = 'val-' + Date.now();
        corevalues.push(newValue);
      }
      await cloudWrite('corevalues.json', 'ge_db_corevalues', corevalues);
      responseData = { success: true, coreValue: newValue };
    } else if (method === 'DELETE' && targetId) {
      const updated = corevalues.filter((v: any) => v.id !== targetId);
      await cloudWrite('corevalues.json', 'ge_db_corevalues', updated);
      responseData = { success: true };
    }
  }

  // 13. Focus Areas fallback
  else if (path === '/api/focusareas' || path.startsWith('/api/focusareas/')) {
    const id = path.split('/').pop();
    const queryId = parsedUrl.searchParams.get('id');
    const targetId = id && id !== 'focusareas' ? id : queryId;
    const focusareas = await cloudRead<any[]>('focusareas.json', 'ge_db_focusareas', []);

    if (method === 'GET') {
      responseData = focusareas;
    } else if (method === 'POST') {
      const newFocus = body;
      if (newFocus?.id || targetId) {
        const editId = newFocus?.id || targetId;
        const idx = focusareas.findIndex((f: any) => f.id === editId);
        if (idx !== -1) focusareas[idx] = { ...focusareas[idx], ...newFocus, id: editId };
        else focusareas.push({ ...newFocus, id: editId });
      } else {
        newFocus.id = 'focus-' + Date.now();
        focusareas.push(newFocus);
      }
      await cloudWrite('focusareas.json', 'ge_db_focusareas', focusareas);
      responseData = { success: true, focusArea: newFocus };
    } else if (method === 'DELETE' && targetId) {
      const updated = focusareas.filter((f: any) => f.id !== targetId);
      await cloudWrite('focusareas.json', 'ge_db_focusareas', updated);
      responseData = { success: true };
    }
  }

  return new Response(JSON.stringify(responseData), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Synchronize server-side changes back into client-side localStorage
function syncLocalCache(url: string, method: string, data: any) {
  if (typeof window === 'undefined' || !data) return;
  try {
    const parsedUrl = new URL(url, window.location.origin);
    const path = parsedUrl.pathname;
    
    const keyMap: Record<string, string> = {
      '/api/projects': 'ge_db_projects',
      '/api/blogs': 'ge_db_blogs',
      '/api/team': 'ge_db_team',
      '/api/gallery': 'ge_db_gallery',
      '/api/volunteers': 'ge_db_volunteers',
      '/api/donations': 'ge_db_donations',
      '/api/subscribers': 'ge_db_subscribers',
      '/api/contacts': 'ge_db_contacts',
      '/api/settings': 'ge_db_settings',
      '/api/testimonials': 'ge_db_testimonials',
      '/api/milestones': 'ge_db_milestones',
      '/api/corevalues': 'ge_db_corevalues',
      '/api/focusareas': 'ge_db_focusareas'
    };

    let matchingKey = '';
    for (const [route, key] of Object.entries(keyMap)) {
      if (path === route || path.startsWith(route + '/')) {
        matchingKey = key;
        break;
      }
    }

    if (matchingKey && method === 'GET') {
      localStorage.setItem(matchingKey, JSON.stringify(data));
    }
  } catch (e) {
    console.warn('Error during syncLocalCache:', e);
  }
}

// Global fetch interceptor setup
if (typeof window !== 'undefined') {
  initStorage();

  const originalFetch = window.fetch;

  const interceptedFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === 'string' ? input : (input instanceof URL ? input.href : input.url);
    
    if (urlStr.includes('/api/')) {
      try {
        const response = await originalFetch(input, init);
        const contentType = response.headers.get('content-type') || '';
        
        // If the server fails, returned a 404, or returned an HTML fallback (Vercel SPA routing)
        // We only fallback for error status codes if the response is NOT a valid JSON API error payload
        const isJson = contentType.includes('application/json');
        if ((!response.ok && !isJson) || response.status === 404 || contentType.includes('text/html')) {
          return await handleFallback(urlStr, init);
        }

        // Sync local cache if the response is a successful JSON
        if (response.ok && isJson) {
          try {
            const clone = response.clone();
            clone.json().then((data) => {
              const method = init?.method?.toUpperCase() || 'GET';
              syncLocalCache(urlStr, method, data);
            }).catch(() => {});
          } catch (e) {
            console.warn('Failed to clone and sync response:', e);
          }
        }

        return response;
      } catch (error) {
        console.warn('API connection failed, falling back to client-side localStorage:', error);
        return await handleFallback(urlStr, init);
      }
    }
    
    return originalFetch(input, init);
  };

  try {
    // Try simple assignment first
    (window as any).fetch = interceptedFetch;
  } catch (e) {
    console.warn('Direct assignment to window.fetch failed, trying Object.defineProperty:', e);
    try {
      Object.defineProperty(window, 'fetch', {
        value: interceptedFetch,
        configurable: true,
        writable: true,
        enumerable: true
      });
    } catch (err) {
      console.error('Could not redefine window.fetch. LocalStorage fallback API might not be active:', err);
    }
  }
}
