/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PROJECTS, BLOG_POSTS, TEAM_MEMBERS, GALLERY_ITEMS } from './data';

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
      address: 'House 42, Road 11, Dhanmondi, Dhaka'
    }));
  }
};

// Handle fallback responses locally
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
    const { username, password } = body || {};
    const storedPassword = localStorage.getItem('green-earth-admin-password') || 'greenearth2026';
    if (username === 'admin' && password === storedPassword) {
      responseData = { success: true, token: 'demo-token-client-2026' };
    } else {
      status = 401;
      responseData = { success: false, error: 'Invalid username or password' };
    }
  }
  
  // 2. Settings fallback
  else if (path === '/api/settings') {
    if (method === 'GET') {
      responseData = JSON.parse(localStorage.getItem('ge_db_settings') || '{}');
    } else if (method === 'POST') {
      localStorage.setItem('ge_db_settings', JSON.stringify(body));
      if (body?.password) {
        localStorage.setItem('green-earth-admin-password', body.password);
      }
      responseData = { success: true };
    }
  }
  
  // 3. Projects fallback
  else if (path === '/api/projects' || path.startsWith('/api/projects/')) {
    const id = path.split('/').pop();
    const projects = JSON.parse(localStorage.getItem('ge_db_projects') || '[]');
    
    if (method === 'GET') {
      responseData = projects;
    } else if (method === 'POST') {
      const newProject = body;
      if (newProject?.id) {
        const idx = projects.findIndex((p: any) => p.id === newProject.id);
        if (idx !== -1) projects[idx] = newProject;
      } else {
        newProject.id = 'proj-' + Date.now();
        projects.unshift(newProject);
      }
      localStorage.setItem('ge_db_projects', JSON.stringify(projects));
      responseData = { success: true };
    } else if (method === 'DELETE' && id && id !== 'projects') {
      const updated = projects.filter((p: any) => p.id !== id);
      localStorage.setItem('ge_db_projects', JSON.stringify(updated));
      responseData = { success: true };
    }
  }
  
  // 4. Blogs fallback
  else if (path === '/api/blogs' || path.startsWith('/api/blogs/')) {
    const id = path.split('/').pop();
    const blogs = JSON.parse(localStorage.getItem('ge_db_blogs') || '[]');
    
    if (method === 'GET') {
      responseData = blogs;
    } else if (method === 'POST') {
      const newBlog = body;
      if (newBlog?.id) {
        const idx = blogs.findIndex((b: any) => b.id === newBlog.id);
        if (idx !== -1) blogs[idx] = newBlog;
      } else {
        newBlog.id = 'blog-' + Date.now();
        newBlog.date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        newBlog.dateBn = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
        blogs.unshift(newBlog);
      }
      localStorage.setItem('ge_db_blogs', JSON.stringify(blogs));
      responseData = { success: true };
    } else if (method === 'DELETE' && id && id !== 'blogs') {
      const updated = blogs.filter((b: any) => b.id !== id);
      localStorage.setItem('ge_db_blogs', JSON.stringify(updated));
      responseData = { success: true };
    }
  }
  
  // 5. Team fallback
  else if (path === '/api/team' || path.startsWith('/api/team/')) {
    const id = path.split('/').pop();
    const team = JSON.parse(localStorage.getItem('ge_db_team') || '[]');
    
    if (method === 'GET') {
      responseData = team;
    } else if (method === 'POST') {
      const newMember = body;
      if (newMember?.id) {
        const idx = team.findIndex((t: any) => t.id === newMember.id);
        if (idx !== -1) team[idx] = newMember;
      } else {
        newMember.id = 'team-' + Date.now();
        team.push(newMember);
      }
      localStorage.setItem('ge_db_team', JSON.stringify(team));
      responseData = { success: true };
    } else if (method === 'DELETE' && id && id !== 'team') {
      const updated = team.filter((t: any) => t.id !== id);
      localStorage.setItem('ge_db_team', JSON.stringify(updated));
      responseData = { success: true };
    }
  }
  
  // 6. Gallery fallback
  else if (path === '/api/gallery' || path.startsWith('/api/gallery/')) {
    const id = path.split('/').pop();
    const gallery = JSON.parse(localStorage.getItem('ge_db_gallery') || '[]');
    
    if (method === 'GET') {
      responseData = gallery;
    } else if (method === 'POST') {
      const newItem = body;
      if (newItem?.id) {
        const idx = gallery.findIndex((g: any) => g.id === newItem.id);
        if (idx !== -1) gallery[idx] = newItem;
      } else {
        newItem.id = 'gal-' + Date.now();
        gallery.unshift(newItem);
      }
      localStorage.setItem('ge_db_gallery', JSON.stringify(gallery));
      responseData = { success: true };
    } else if (method === 'DELETE' && id && id !== 'gallery') {
      const updated = gallery.filter((g: any) => g.id !== id);
      localStorage.setItem('ge_db_gallery', JSON.stringify(updated));
      responseData = { success: true };
    }
  }
  
  // 7. Volunteers fallback
  else if (path === '/api/volunteers' || path.startsWith('/api/volunteers/')) {
    const id = path.split('/').pop();
    const volunteers = JSON.parse(localStorage.getItem('ge_db_volunteers') || '[]');
    
    if (method === 'GET') {
      responseData = volunteers;
    } else if (method === 'POST') {
      const volunteer = {
        ...body,
        id: body?.id || 'vol-' + Date.now(),
        date: body?.date || new Date().toISOString().split('T')[0]
      };
      const idx = volunteers.findIndex((v: any) => v.id === volunteer.id);
      if (idx !== -1) {
        volunteers[idx] = volunteer;
      } else {
        volunteers.unshift(volunteer);
      }
      localStorage.setItem('ge_db_volunteers', JSON.stringify(volunteers));
      responseData = { success: true };
    } else if (method === 'DELETE' && id && id !== 'volunteers') {
      const updated = volunteers.filter((v: any) => v.id !== id);
      localStorage.setItem('ge_db_volunteers', JSON.stringify(updated));
      responseData = { success: true };
    }
  }
  
  // 8. Donations fallback
  else if (path === '/api/donations' || path.startsWith('/api/donations/')) {
    const id = path.split('/').pop();
    const donations = JSON.parse(localStorage.getItem('ge_db_donations') || '[]');
    
    if (method === 'GET') {
      responseData = donations;
    } else if (method === 'POST') {
      const donation = {
        ...body,
        id: body?.id || 'don-' + Date.now(),
        date: body?.date || new Date().toISOString().split('T')[0]
      };
      const idx = donations.findIndex((d: any) => d.id === donation.id);
      if (idx !== -1) {
        donations[idx] = donation;
      } else {
        donations.unshift(donation);
      }
      localStorage.setItem('ge_db_donations', JSON.stringify(donations));
      responseData = { success: true };
    } else if (method === 'DELETE' && id && id !== 'donations') {
      const updated = donations.filter((d: any) => d.id !== id);
      localStorage.setItem('ge_db_donations', JSON.stringify(updated));
      responseData = { success: true };
    }
  }
  
  // 9. Subscribers fallback
  else if (path === '/api/subscribers') {
    const subscribers = JSON.parse(localStorage.getItem('ge_db_subscribers') || '[]');
    
    if (method === 'GET') {
      responseData = subscribers;
    } else if (method === 'POST') {
      const newSub = {
        email: body?.email,
        date: new Date().toISOString().split('T')[0]
      };
      if (body?.email && !subscribers.some((s: any) => s.email === body.email)) {
        subscribers.unshift(newSub);
        localStorage.setItem('ge_db_subscribers', JSON.stringify(subscribers));
      }
      responseData = { success: true };
    } else if (method === 'DELETE') {
      const updated = subscribers.filter((s: any) => s.email !== body?.email);
      localStorage.setItem('ge_db_subscribers', JSON.stringify(updated));
      responseData = { success: true };
    }
  }
  
  // 10. Contacts fallback
  else if (path === '/api/contacts' || path.startsWith('/api/contacts/')) {
    const id = path.split('/').pop();
    const contacts = JSON.parse(localStorage.getItem('ge_db_contacts') || '[]');
    
    if (method === 'GET') {
      responseData = contacts;
    } else if (method === 'POST') {
      const newContact = {
        ...body,
        id: 'contact-' + Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      contacts.unshift(newContact);
      localStorage.setItem('ge_db_contacts', JSON.stringify(contacts));
      responseData = { success: true };
    } else if (method === 'DELETE' && id && id !== 'contacts') {
      const updated = contacts.filter((c: any) => c.id !== id);
      localStorage.setItem('ge_db_contacts', JSON.stringify(updated));
      responseData = { success: true };
    }
  }

  return new Response(JSON.stringify(responseData), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
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
        if (!response.ok || contentType.includes('text/html') || response.status === 404) {
          return await handleFallback(urlStr, init);
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
