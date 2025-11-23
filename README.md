# Edu-News Platform

A modern educational news and notifications platform featuring a beautiful Next.js frontend with cloud-ready backend integration.

## 🎯 Current Status

### ✅ Frontend (Complete)
- **Next.js 14** with React 18
- **Premium UI Design** with glassmorphism effects
- **TailwindCSS** styling with Framer Motion animations
- **PWA Support** for mobile installation
- **Responsive Design** for all devices

### 🚧 Backend (Ready for Integration)
The backend has been cleaned up and is ready for fresh integration with your cloud services.

## 📁 Project Structure

```
Edu-News/
├── apps/
│   └── web/              # Next.js Frontend Application
│       ├── src/
│       │   ├── pages/    # Next.js pages (routes)
│       │   ├── components/  # React components
│       │   ├── styles/   # Global styles
│       │   └── lib/      # Utilities and helpers
│       └── public/       # Static assets
├── package.json          # Root package file
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Cloud PostgreSQL database (e.g., Neon, Supabase)
- Cloud Redis instance (e.g., Upstash) - optional

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cd apps/web
   cp .env.example .env.local
   # Edit .env.local with your backend API URL
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Frontend Features

### Pages
- **Home Page** - Landing page with hero section and featured content
- **Feed Page** - Scrollable news feed with category filtering
- **Article Detail** - Beautiful reading experience with sticky sidebar
- **Saved Items** - Bookmarked articles page
- **Login/Signup** - Authentication pages with social auth support

### Components
- **Button** - Reusable button with multiple variants and animations
- **Card** - Generic card component with glassmorphism support
- **Sidebar** - Collapsible navigation with active states
- **Topbar** - Sticky header with search functionality
- **ArticleCard** - Specialized card for news items
- **MainLayout** - Consistent layout wrapper

### Design System
- **Premium Aesthetics** with glassmorphism and gradients
- **Modern Typography** using Inter font family
- **Smooth Animations** with Framer Motion
- **Dark Mode** optimized color palette
- **Responsive** mobile-first design

## 🔧 Environment Variables

Create `apps/web/.env.local`:

```env
# Backend API URL (update when you integrate your backend)
NEXT_PUBLIC_API_URL=http://localhost:4000

# Optional: Firebase/Push Notifications
NEXT_PUBLIC_FIREBASE_CONFIG=your-config-here
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-key
```

## 📱 Available Scripts

From the root directory:

```bash
npm run dev        # Start frontend development server
npm run build      # Build frontend for production
npm run test       # Run frontend tests
npm run lint       # Lint frontend code
```

From `apps/web`:

```bash
npm run dev        # Start Next.js dev server
npm run build      # Build for production
npm run start      # Start production server
npm run test       # Run Jest tests
npm run storybook  # Start Storybook UI component explorer
```

## 🔌 Backend Integration Guide

When you're ready to integrate your backend:

1. **Create your backend service** (Node.js, Python, etc.)
2. **Set up cloud database** (PostgreSQL on Neon, Supabase, etc.)
3. **Configure Redis** for caching/queues (Upstash, Redis Cloud, etc.)
4. **Update environment variables** in `apps/web/.env.local`
5. **Implement API endpoints** that the frontend expects:
   - `GET /api/feed` - Get news articles
   - `GET /api/articles/:id` - Get article details
   - `POST /api/auth/login` - User authentication
   - `POST /api/auth/register` - User registration
   - And more as needed...

## 🌐 Deployment

### Frontend (Vercel - Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure build settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Add environment variables
5. Deploy!

### Alternative: Netlify

1. Connect repository to Netlify
2. Set base directory to `apps/web`
3. Build command: `npm run build`
4. Publish directory: `.next`

## 🎓 Default Credentials

When backend is integrated, use these test accounts:
- **Admin:** admin@example.com / admin123
- **User:** student1@example.com / password123

## 📚 Tech Stack

### Frontend
- **Framework:** Next.js 14
- **UI Library:** React 18
- **Styling:** TailwindCSS 3.3
- **Animations:** Framer Motion
- **State Management:** React Query (TanStack Query)
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios
- **Icons:** Heroicons + Lucide React

### Backend (To Be Integrated)
- Your choice! (NestJS, Express, FastAPI, Django, etc.)
- PostgreSQL database
- Redis for caching (optional)
- Firebase for push notifications (optional)

## 📄 License

MIT

---

**Ready to integrate your backend!** 🚀

The frontend is fully functional and ready. Now you can build your backend with your preferred technology stack and connect it to the cloud database you've set up.
