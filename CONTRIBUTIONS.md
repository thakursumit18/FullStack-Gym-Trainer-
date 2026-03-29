# 👥 Team Contributions — GymTrainer App

> A full-stack MERN fitness web application built and deployed by a team of 5.
> Below is the complete breakdown of each member's contribution.

---

## 1. 🧠 Nishant Kumar — Backend Architecture, Auth & Deployment

**Role:** Backend Lead + DevOps

### What was built:
Nishant was responsible for the entire backend foundation. He set up the Node.js + Express server, configured MongoDB Atlas connection using Mongoose, and designed all three database schemas (User, Progress, Feedback).

He implemented the full JWT-based authentication system — signup with bcryptjs password hashing, login with token generation, and protected route middleware. He also added production-grade security: Helmet headers, rate limiting (general, auth, chat), body size limits, and CORS configuration for deployment.

He handled the full deployment pipeline — pushing to GitHub, deploying backend on Render with all environment variables, connecting MongoDB Atlas, and linking frontend to backend via CORS and `CLIENT_URL`.

### Key files:
- `be/server.js` — Express + security middleware + all routes
- `be/config/db.js` — MongoDB Atlas connection
- `be/models/User.js` — User schema with bcrypt pre-save hook
- `be/models/Progress.js` — Progress tracking schema
- `be/models/Feedback.js` — Feedback collection schema
- `be/middleware/auth.js` — JWT protect + adminOnly
- `be/controllers/authController.js` — Signup, login, profile
- `be/routes/authRoutes.js`
- `be/.env.example` — Environment variable documentation

### Technical highlights:
- Fixed bcryptjs v3 breaking change (`next is not a function`)
- URL-encoded `@` in MongoDB Atlas password (`%40`) for connection string
- Configured Helmet, express-rate-limit, 10kb body limit
- CORS reads `CLIENT_URL` from env for production support
- Strong JWT secret with special characters

---

## 2. 🏋️ Navpreet Tripathy — Workout Engine, Diet Engine & Admin Panel

**Role:** Core Features Developer

### What was built:
Navpreet built the core logic that makes the app useful — the workout plan generator and diet plan generator. He designed all three goal-based weekly workout splits (Lose Fat, Gain Muscle, Maintain) with 7 days each, covering 45+ exercises with sets and reps.

He built the diet plan system with Indian food options, calculating daily calories and protein targets based on user weight and goal. On the frontend, he built the Workout page with day tabs, exercise checklist with daily auto-reset, animated progress bar, and the Admin panel.

### Key files:
- `be/controllers/workoutController.js` — 3 full weekly plans (21 unique days)
- `be/controllers/dietController.js` — Meal plans with Indian food
- `be/controllers/progressController.js` — Progress upsert logic
- `be/controllers/feedbackController.js` — Feedback CRUD
- `be/routes/workoutRoutes.js`, `dietRoutes.js`, `progressRoutes.js`, `feedbackRoutes.js`
- `fe/src/pages/Workout.jsx` — Weekly plan UI + exercise checklist
- `fe/src/pages/Diet.jsx` — Meal plan UI with macros
- `fe/src/pages/Admin.jsx` — Admin panel

### Technical highlights:
- 21 unique workout days across 3 goals (7 days × 3 plans)
- localStorage-based daily checkbox reset using date-keyed storage
- Calorie formula: `weight × 24 ± 500` based on goal
- Protein targets: 1.6g–2.2g per kg based on goal
- Feedback model: rating, category, goalSatisfaction, whatWorked, improvement, wouldRecommend, usageFrequency

---

## 3. 🎨 Sumit Thakur — Frontend UI, Animations, AI Chatbot & Home Page

**Role:** Frontend Lead + UI/UX Engineer

### What was built:
Sumit transformed the app into a professional, animated, interactive experience. He integrated Framer Motion across the entire frontend — page transitions, staggered card animations, animated progress bars, spring-physics navbar, and micro-interactions.

He built all smart UI components: StreakCard, GoalProgress, SmartMessage, AnimatedButton, PageWrapper, ScrollToTop. He built the ExerciseModal with 45+ real exercise images from Wger API (hardcoded direct URLs for instant loading).

He built the complete AI FitBot chatbot using Google Gemini 2.5 Flash — floating button, chat window, typing indicator, quick prompts, Hinglish personality, and user profile context. He also built the full landing home page with parallax hero, feature slideshow, quote ticker, photo gallery, and scroll animations.

### Key files:
- `fe/src/pages/Home.jsx` — Full landing page
- `fe/src/components/ChatBot.jsx` — AI FitBot floating chatbot
- `be/controllers/chatController.js` — Gemini 2.5 Flash via direct HTTPS
- `be/routes/chatRoutes.js`
- `fe/src/components/ExerciseModal.jsx` — Exercise modal with Wger images
- `fe/src/components/StreakCard.jsx` — Streak + 7-day dots
- `fe/src/components/GoalProgress.jsx` — Animated goal progress bar
- `fe/src/components/SmartMessage.jsx` — Contextual motivation banner
- `fe/src/components/AnimatedButton.jsx` — Reusable animated button
- `fe/src/components/PageWrapper.jsx` — Page transition wrapper
- `fe/src/components/ScrollToTop.jsx` — Scroll reset on route change
- `fe/src/components/Navbar.jsx` — Animated navbar + hamburger menu
- `fe/src/pages/NotFound.jsx` — Custom 404 page
- `fe/src/App.jsx` — Full routing with AnimatePresence
- `fe/vite.config.js` — Tailwind v4 + proxy + build optimization

### Technical highlights:
- Manually verified 45+ unique Wger image URLs — zero API calls at runtime
- Gemini 2.5 Flash via direct HTTPS (bypassed SDK version issue)
- `layoutId` spring-physics navbar active indicator
- Parallax hero using `useScroll` + `useTransform`
- Scroll-triggered `useInView` fade-up animations
- Animated counter numbers on home page stats
- Auto-advancing slideshow + quote ticker
- Hamburger menu with animated X transition
- Smart message covers 7 behavioral states

---

## 4. 📊 Prajakta Sahoo — Progress Tracker, Charts & BMI Calculator

**Role:** Data Visualization Engineer

### What was built:
Prajakta built the entire Progress Tracker page — the most data-rich page in the app. She integrated Recharts to display four chart types and designed the full logging form with detailed body metrics.

She built the 5-tab layout (Overview, Body, Workouts, Log Today, Feedback), weight trend area chart, workout consistency bar chart, body measurements line chart, and body fat area chart. She also built the BMI calculator with animated color-coded scale bar and the body fat category system.

### Key files:
- `fe/src/pages/Progress.jsx` — Full progress tracker (5 tabs + all charts)
- `be/models/Progress.js` — Extended schema (bodyFat, chest, waist, hips, mood, notes)

### Technical highlights:
- BMI formula: `weight / (height_m)²` with animated pointer on scale bar
- BMI categories: Underweight / Normal / Overweight / Obese with color coding
- Body fat categories: Essential / Athletic / Fitness / Average / Above Average
- 4 chart types: AreaChart (weight), BarChart (consistency), LineChart (measurements), AreaChart (body fat)
- Custom `CustomTooltip` component for all Recharts charts
- Mood breakdown showing count per mood type
- Consistency % formula: `workoutsCompleted / totalEntries × 100`
- Feedback tab with star rating, category selector, goal satisfaction score

---

## 5. 🔐 Soumya Smruti — Auth UI, Axios Integration & Deployment

**Role:** Frontend Auth + API Integration + Vercel Deployment

### What was built:
Soumya handled the frontend authentication flow and global API integration. She built the Login and Signup pages with validation and error handling, and set up AuthContext for global user state management.

She configured the Axios instance with JWT token interceptor and 401 auto-logout handler. She built ProtectedRoute for auth guarding. She also handled the Vercel deployment — configuring root directory, build settings, and `VITE_API_URL` environment variable to connect to the Render backend.

### Key files:
- `fe/src/pages/Login.jsx` — Login page with error handling
- `fe/src/pages/Signup.jsx` — Signup with 2-step validation
- `fe/src/context/AuthContext.jsx` — Global auth state
- `fe/src/api/axios.js` — Axios with JWT interceptor + 401 handler
- `fe/src/components/ProtectedRoute.jsx` — Auth guard (redirects to home)
- `fe/src/index.css` — Global Tailwind CSS
- `fe/index.html` — SEO meta tags, OG tags, theme color
- `fe/.env.example` — Frontend env documentation

### Technical highlights:
- JWT token stored in localStorage, auto-attached to every request
- 401 interceptor clears token and redirects to home page
- ProtectedRoute redirects unauthenticated users to `/` (home)
- Logout redirects to home page (not login)
- Password minimum 6 characters validation on frontend + backend
- SEO: title, description, keywords, OG tags, Twitter card, theme color
- `VITE_API_URL` env var for production backend URL on Vercel

---

## 📋 Final Contribution Summary

| Member | Role | Primary Responsibility |
|---|---|---|
| Nishant Kumar | Backend Lead + DevOps | Server, Auth, Security, MongoDB Atlas, Render Deploy |
| Navpreet Tripathy | Core Features Dev | Workout Engine, Diet Engine, Admin, Feedback API |
| Sumit Thakur | Frontend Lead + AI | UI/UX, Animations, Home Page, FitBot AI, Exercise Modal |
| Prajakta Sahoo | Data Visualization | Progress Tracker, Charts, BMI Calculator, Body Fat |
| Soumya Smruti | Auth + Integration | Login/Signup, Axios, AuthContext, Vercel Deploy |

---

## 🌐 Deployed On

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| AI | Google Gemini 2.5 Flash |

---

## 📊 Project Stats

| Metric | Count |
|---|---|
| Total files created | 35+ |
| Backend routes | 13 API endpoints |
| Frontend pages | 9 pages |
| Reusable components | 10 components |
| Exercises covered | 45+ |
| Workout plans | 21 unique days (3 goals × 7 days) |
| Exercise images | 45+ unique Wger URLs |
| Lines of code | ~4000+ |

---

<div align="center">
  <p>Built with ❤️ by a team of 5 — MERN Stack</p>
  <p>💪 Stay consistent. Results follow.</p>
</div>
