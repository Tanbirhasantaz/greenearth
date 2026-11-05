# 🌱 Green Earth (গ্রিন আর্থ)

> **Cleaner, Greener & Sustainable Future for Bangladesh**  
> An open-source, full-featured web platform and CMS for environmental action, reforestation drives, solar micro-grid installations, and clean drinking water initiatives across Bangladesh.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](LICENSE)

---

## 📖 Overview

**Green Earth** is a non-profit environmental organization platform designed to showcase environmental conservation projects, recruit and coordinate volunteers, accept donation pledges, and run the **Green Hero Initiative** (tree adoption and monthly growth tracking).

### Key Highlights
- **Dual Language Support:** Full native bilingual support in **English** and **বাংলা (Bangla)** across all public views and admin controls.
- **Robust Admin Dashboard:** Integrated Content Management System (CMS) for managing:
  - Projects (Tree Plantation, Renewable Energy, Water Conservation, Waste Management)
  - Blog Posts & Field News
  - Volunteer Applications & Status Updates
  - Donation Records & Transparency Logs
  - Photo Gallery & Media Lightbox
  - Team Members, Milestones, and Organization Core Values
- **Security-First Backend:**
  - Token-based admin authentication with HMAC-SHA256 signatures and expiration.
  - Salted and scrypt-hashed admin passwords.
  - Protected mutation routes preventing unauthorized tampering with projects, donations, or volunteer data.
- **Resilient Data Architecture:**
  - Works with local JSON files out-of-the-box for instant local development.
  - Synchronizes with **Supabase** for persistent cloud storage, image uploads, and cross-instance syncing.
  - Built-in client-side fallback mode with `localStorage` persistence when running as a static SPA.

---

## 📁 Repository Structure

```
greenearth/
├── assets/                     # Project assets and configurations
├── data/                       # Default initial JSON data records
│   ├── projects.json           # Reforestation and solar projects
│   ├── blogs.json              # Environmental articles and news
│   ├── team.json               # Core team profiles
│   ├── gallery.json            # Gallery images
│   ├── settings.json           # General site configuration & credentials
│   └── ...
├── green-earth-next/           # 🚀 Modern Next.js 14 App Router version
│   ├── src/app/                # Route groups: (admin) and (public)
│   ├── src/lib/supabase/       # Server/Client Supabase clients
│   └── supabase/schema.sql     # PostgreSQL relational database schema
├── public/                     # Static files, robots.txt, and sitemap.xml
├── src/                        # ⚡ Vite + React Single Page Application
│   ├── assets/                 # Local images and visual assets
│   ├── components/             # Reusable UI components (Modals, Header, Footer)
│   ├── views/                  # Main views (Home, About, Projects, Blog, Admin)
│   ├── api-fallback.ts         # Resilient fetch interceptor and localStorage sync
│   └── App.tsx                 # Core application shell and routing
├── server.ts                   # Express.js backend API server & Vite integration
├── package.json                # Project dependencies and build scripts
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or later recommended)
- **npm** or **pnpm**

### 1. Clone the Repository
```bash
git clone https://github.com/Tanbirhasantaz/greenearth.git
cd greenearth
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```
Update `.env` with your desired configuration:
```env
PORT=3000
ADMIN_EMAIL=greenearthbd.25@gmail.com
ADMIN_PASSWORD=your_strong_password_here
ADMIN_JWT_SECRET=your_secure_random_jwt_secret

# Optional: Supabase for cloud image storage and database sync
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_BUCKET=green-earth-images
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Build & Production Deployment

### Build the Application
```bash
npm run build
```
This will compile the client application via Vite into `dist/` and bundle `server.ts` into `dist/server.cjs`.

### Start the Production Server
```bash
npm start
```

---

## 🔒 Security Best Practices

1. **Change Default Credentials:** Never use default passwords in production. Set strong `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_JWT_SECRET` in your `.env` file or hosting environment variables.
2. **Protected Endpoints:** All administrative endpoints (`POST /api/upload`, `POST /api/projects`, `DELETE /api/projects/:id`, etc.) require a valid `Authorization: Bearer <token>` header.
3. **Environment Security:** Ensure `.env` is never committed to version control (`.gitignore` is pre-configured).

---

## 🌿 Next.js Migration (`green-earth-next/`)

This repository also includes `green-earth-next/`, a Next.js 14 (App Router) version with:
- Full Server-Side Rendering (SSR) & Static Site Generation (SSG) for optimal SEO.
- Native Supabase SSR (`@supabase/ssr`) with Row-Level Security (RLS) policies.
- Type-safe database queries mapped to `supabase/schema.sql`.

To run the Next.js version:
```bash
cd green-earth-next
npm install
npm run dev
```

---

## 🤝 Contributing

Contributions to improve Green Earth are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **Apache-2.0 License**. See `LICENSE` for more information.
