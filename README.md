<div align="center">

# 🎓 EduNews - Educational News Platform

### Stay Ahead of Every Educational Opportunity

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

**[Live Demo](https://edu-news-platform.vercel.app)** • **[Documentation](#-features)** • **[Getting Started](#-quick-start)**

---

</div>

## 📖 About

**EduNews** is a modern, real-time educational news and notifications platform designed to help students never miss important updates about exams, scholarships, admissions, and results. Built with cutting-edge web technologies and a premium UI/UX design.

### ✨ Why EduNews?

- 🚀 **Real-time Updates** - Get instant notifications for exam dates, results, and scholarships
- 🎯 **Smart Filtering** - Focus on what matters with category-based filtering (JEE, NEET, UPSC, etc.)
- 💾 **Bookmark Articles** - Save important updates for later reference
- 🔐 **Secure Authentication** - Firebase-powered authentication with Google Sign-In
- 📱 **Responsive Design** - Beautiful experience on all devices
- ⚡ **Lightning Fast** - Optimized performance with Next.js and modern best practices

---

## 🎨 Features

### 🏠 Landing Page
- Eye-catching hero section with glassmorphism effects
- "Get Updates" modal showing top 50 exam-related articles
- Feature highlights and testimonials
- Smooth animations with Framer Motion

### � News Feed
- Real-time article streaming with infinite scroll
- Category filtering (Exams, Results, Scholarships, Admissions)
- Search functionality
- Auto-refresh every 60 seconds

### 🔖 Bookmarks
- Save articles for later reading
- Organized bookmark management
- Quick access to saved content

### 👤 User Authentication
- Email/Password authentication
- Google Sign-In integration
- Protected routes and personalized experience
- Firebase Authentication backend

### 🎯 Smart Notifications
- Exam-focused content filtering
- Keyword-based article categorization
- Relevant updates for JEE, NEET, UPSC, SSC, and more

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.0
- **UI Library:** React 18
- **Styling:** TailwindCSS 3.3
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Authentication:** Firebase Auth

### Backend
- **Runtime:** Node.js with Express
- **Database:** PostgreSQL (Neon)
- **Caching:** Redis (Optional)
- **News Ingestion:** RSS Parser + NewsAPI
- **Authentication:** Firebase Admin SDK
- **Deployment:** Render.com

### DevOps
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Version Control:** Git & GitHub
- **CI/CD:** Automatic deployments via Vercel & Render

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon, Supabase, or local)
- Firebase project (for authentication)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/laxmiv101085-web/Edu-News.git
   cd Edu-News
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   **Frontend** (`apps/web/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   ```

   **Backend** (`apps/api/.env`):
   ```env
   DATABASE_URL=your_postgresql_connection_string
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   NEWS_SOURCES=https://rss-feed-1.com,https://rss-feed-2.com
   PORT=4000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:4000](http://localhost:4000)

---

## 📁 Project Structure

```
Edu-News/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   │   ├── landing/    # Landing page components
│   │   │   │   └── ui/         # Reusable UI components
│   │   │   ├── contexts/       # React contexts (Auth, Notifications)
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── lib/            # Utilities and API client
│   │   │   ├── pages/          # Next.js pages
│   │   │   └── styles/         # Global styles
│   │   └── public/             # Static assets
│   │
│   └── api/                    # Express Backend
│       ├── src/
│       │   ├── auth.js         # Authentication routes
│       │   ├── database.js     # Database connection
│       │   ├── index.js        # Main server file
│       │   └── ingestion.js    # News ingestion logic
│       └── .env                # Backend environment variables
│
├── package.json                # Root package configuration
└── README.md                   # You are here!
```

---

## � Available Scripts

### Root Directory

```bash
npm run dev              # Start both frontend and backend
npm run dev:web          # Start frontend only
npm run dev:api          # Start backend only
npm run build            # Build frontend for production
npm run start            # Start production server
```

### Frontend (`apps/web`)

```bash
npm run dev              # Development server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Lint code
npm run test             # Run tests
```

### Backend (`apps/api`)

```bash
npm run dev              # Development server with nodemon
npm start                # Production server
```

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure:
   - **Framework:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
4. Add environment variables
5. Deploy! 🚀

### Backend (Render)

1. Create new Web Service on [Render](https://render.com)
2. Connect GitHub repository
3. Configure:
   - **Root Directory:** `apps/api`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables
5. Deploy! 🚀

---

## 🔑 Key Features Explained

### Real-Time News Ingestion

The backend automatically fetches and categorizes educational news from multiple RSS feeds every 30 minutes:

- Filters content using education-specific keywords
- Categorizes articles (Exams, Results, Scholarships, Admissions)
- Extracts images from RSS feeds and article pages
- Deduplicates articles based on URLs

### Smart Article Filtering

Articles are intelligently categorized using keyword matching:

```javascript
// Example: Exam detection
if (text.match(/\b(jee|neet|upsc|gate)\b/i)) {
  category = 'exams';
}
```

### Authentication Flow

1. User signs up/logs in via Firebase
2. Frontend receives Firebase ID token
3. Token sent to backend for verification
4. Backend creates/syncs user in PostgreSQL
5. User gets access to protected features (bookmarks, notifications)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Laxmi Vishwakarma**

- GitHub: [@laxmiv101085-web](https://github.com/laxmiv101085-web)
- Repository: [Edu-News](https://github.com/laxmiv101085-web/Edu-News)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Firebase](https://firebase.google.com/) - Authentication and hosting
- [Vercel](https://vercel.com/) - Frontend deployment
- [Render](https://render.com/) - Backend deployment
- [Neon](https://neon.tech/) - Serverless PostgreSQL

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ for students across India**

[Report Bug](https://github.com/laxmiv101085-web/Edu-News/issues) • [Request Feature](https://github.com/laxmiv101085-web/Edu-News/issues)

</div>
