import React from 'react';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Green Earth Bangladesh | Cleaner, Greener & Sustainable Future',
  description: 'Environmental organization in Bangladesh working on coastal reforestation, renewable energy transition, safe water sanitation, waste management, and community awareness.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#FAFAF7] text-neutral-800 antialiased font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
