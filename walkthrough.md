# Educational News App UI Walkthrough

I have successfully implemented the premium frontend UI for your Educational News App using React, TailwindCSS, and Framer Motion.

## 🎨 Design Implementation
- **Premium Aesthetic**: Implemented a clean, modern design inspired by Apple and Google Material 3.
- **Visual Enhancements**: Added a global animated background with floating blobs, glassmorphic sidebar and topbar, and refined color palette for a more realistic and attractive look.
- **Design System**: Updated `tokens.js` and `tailwind.config.js` with new border radius values (`xl`, `2xl`, `3xl`) and ensured color tokens are correctly mapped.
- **Animations**: Used `framer-motion` for smooth entry animations, hover effects, and page transitions.

## 📱 Pages Built
1. **Home Page (`/`)**: Features a Hero section with a glassmorphism card, feature stats, and featured news.
2. **News Feed (`/feed`)**: A scrollable feed of article cards with category filtering.
3. **Article Detail (`/article/[id]`)**: A beautiful reading experience with a sticky sidebar for actions.
4. **Saved Items (`/saved`)**: A page to view saved articles (currently shows an empty state with a call to action).
5. **Login (`/login`)**: A minimal, elegant login page with social auth buttons and background animations.

## 🧩 Components Created
- **`Button`**: Reusable button with multiple variants (primary, secondary, ghost, outline) and animations.
- **`Card`**: Generic card component with glassmorphism support.
- **`Sidebar`**: Collapsible sidebar navigation with active states.
- **`Topbar`**: Sticky top header with search and user profile.
- **`ArticleCard`**: specialized card for displaying news items.
- **`Skeleton`**: Loading state component.
- **`MainLayout`**: Wrapper component to ensure consistent layout across pages.

## 🚀 How to Run
1. Navigate to the web app directory:
   ```bash
   cd apps/web
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and visit `http://localhost:3000`.

## 📸 Verification
The project builds successfully (`npm run build` passed). All components are typed with TypeScript and follow the requested design guidelines.
