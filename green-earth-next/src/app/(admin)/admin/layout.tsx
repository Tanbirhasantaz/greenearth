'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import {
  LayoutDashboard,
  TreePine,
  BookOpen,
  Users,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Camera,
  Home,
  Briefcase
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If we are on the login page, bypass the sidebar shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const adminLinks = [
    { href: '/admin', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { href: '/admin/projects', label: 'Campaign Projects', icon: <TreePine size={18} /> },
    { href: '/admin/blog', label: 'Blog Posts', icon: <BookOpen size={18} /> },
    { href: '/admin/volunteers', label: 'Volunteers List', icon: <Users size={18} /> },
    { href: '/admin/donations', label: 'Donations Audit', icon: <Heart size={18} /> },
    { href: '/admin/team', label: 'Team Members', icon: <Briefcase size={18} /> },
    { href: '/admin/gallery', label: 'Media Gallery', icon: <Camera size={18} /> },
    { href: '/admin/settings', label: 'Site Settings', icon: <Settings size={18} /> },
  ];

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // Clear mock cookie too if present
      document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-neutral-900 text-neutral-300 border-r border-neutral-800 shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <Logo size="xs" showWordmark={true} />
          <div className="px-2 py-0.5 bg-forest-green text-[9px] text-white rounded font-mono font-bold tracking-widest uppercase">
            Admin
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-bold transition-all ${
                  active
                    ? 'bg-[#2E7D32] text-white shadow-md shadow-emerald-950/20'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Operations */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-bold text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
            <Home size={18} />
            <span>Visit Live Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE PANEL WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-neutral-950 text-white flex items-center justify-between px-4 shrink-0 z-40">
          <Logo size="xs" showWordmark={true} />
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-full hover:bg-neutral-800 text-white cursor-pointer"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile Slide-out Sidebar Drawer */}
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 top-16 bg-black/60 z-30 lg:hidden"
            />
            {/* Drawer */}
            <div className="fixed top-16 left-0 bottom-0 w-64 bg-neutral-900 border-r border-neutral-800 p-4 flex flex-col z-40 lg:hidden overflow-y-auto">
              <nav className="flex-1 space-y-1">
                {adminLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-bold transition-all ${
                        active
                          ? 'bg-[#2E7D32] text-white shadow-md'
                          : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="pt-4 border-t border-neutral-800 space-y-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-bold text-neutral-400 hover:bg-neutral-800 hover:text-white">
                  <Home size={18} />
                  <span>Visit Live Site</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
