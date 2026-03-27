# 👥 Team Contributions — GymTrainer App

> A MERN stack fitness web application built collaboratively by a team of 5.
> Below is a breakdown of each member's contribution to the project.

---

## 1. 🧠 Nishant Kumar — Backend Architecture & Authentication System

**Role:** Backend Lead

### What was built:
Nishant was responsible for the entire backend foundation of the application. He set up the Node.js + Express server, configured MongoDB connection using Mongoose, and designed the database schema for both `User` and `Progress` models.

He implemented the full **JWT-based authentication system** — including secure signup with bcryptjs password hashing, login with token generation, and protected route middleware. He also built the `adminOnly` middleware for role-based access control.

### Key files owned:
- `be/server.js` — Express server setup, CORS, route mounting
- `be/config/db.js` — MongoDB connection via Mongoose
- `be/models/User.js` — User schema with bcrypt pre-save hook
- `be/models/Progress.js` — Progress tracking schema
- `be/middleware/auth.js` — JWT protect + adminOnly middleware
- `be/controllers/authController.js` — Signup, login, getProfile, updateProfile
- `be/routes/authRoutes.js` — Auth API routes
- `be/.env` — Environment configuration

### Technical highlights:
- Fixed bcryptjs v3 breaking change (`next is not a function` bug)
- Designed upsert logic in progress controller (update if exists, create if not)
- Configured Vite proxy to forward `/api` requests to Express backend

---

## 2. 🏋️ Navpreet Tripathy — Workout & Diet Plan Engine + Admin Panel

**Role:** Core Features Developer

### What was built:
Navpreet built the core logic that makes the app useful — the **workout plan generator** and **diet plan generator**. He designed all three goal-based weekly workout splits (Lose Fat, Gain Muscle, Maintain) with 7 days each, covering 45+ exercises with sets and reps.

He also built the **diet plan system** with Indian food options, calculating daily calories and protein targets based on user weight and goal. On the frontend, he built the Workout page with day tabs, exercise checklist with daily auto-reset, and the Admin panel.

### Key files owned:
- `be/controllers/workoutController.js` — Full weekly plan generator for 3 goals
- `be/controllers/dietController.js` — Meal plan generator with Indian food
- `be/controllers/progressController.js` — Progress log/get with upsert
- `be/routes/workoutRoutes.js` — Workout API routes
- `be/routes/dietRoutes.js` — Diet API routes
- `be/routes/progressRoutes.js` — Progress API routes
- `fe/src/pages/Workout.jsx` — Weekly plan UI with day tabs + exercise checklist
- `fe/src/pages/Diet.jsx` — Meal plan UI with macros display
- `fe/src/pages/Admin.jsx` — Admin panel for viewing all workout plans

### Technical highlights:
- Designed 21 unique workout days across 3 goals (7 days × 3 plans)
- Built localStorage-based daily checkbox reset using date-keyed storage
- Calorie formula: weight × 24 ± 500 based on goal
- Protein targets: 1.6g–2.2g per kg based on goal

---

## 3. 🎨 Sumit Thakur — Frontend UI, Animations & Exercise Modal

**Role:** Frontend Lead & UI/UX Engineer

### What was built:
Sumit was responsible for transforming the app into a **professional, animated, interactive experience**. He integrated Framer Motion across the entire frontend — page transitions, staggered card animations, animated progress bars, spring-physics navbar, and micro-interactions on buttons and checkboxes.

He built all the smart UI components: `StreakCard`, `GoalProgress`, `SmartMessage`, `AnimatedButton`, and `PageWrapper`. He also built the **ExerciseModal** with real exercise images fetched and verified from the Wger open-source fitness API — 45+ exercises each with a unique hardcoded image URL for instant loading.

### Key files owned:
- `fe/src/components/ExerciseModal.jsx` — Exercise detail modal with Wger images
- `fe/src/components/StreakCard.jsx` — Streak counter with 7-day dot visualization
- `fe/src/components/GoalProgress.jsx` — Animated goal progress bar
- `fe/src/components/SmartMessage.jsx` — Contextual motivation banner
- `fe/src/components/AnimatedButton.jsx` — Reusable animated button
- `fe/src/components/PageWrapper.jsx` — Page transition wrapper
- `fe/src/components/Navbar.jsx` — Animated active pill navbar
- `fe/src/App.jsx` — AnimatePresence route transitions
- `fe/src/pages/Dashboard.jsx` — Full dashboard with all smart components
- `fe/vite.config.js` — Tailwind v4 + proxy config

### Technical highlights:
- Manually verified and hardcoded 45+ unique Wger image URLs — zero API calls at runtime
- Implemented `layoutId` spring-physics navbar active indicator
- Built streak calculation logic (current + longest) from progress history
- Smart message logic covers 7 different behavioral states
- Goal progress formula: % of weight change toward 8–10% target

---

## 4. 📊 Prajakta Sahoo — Progress Tracker & Charts

**Role:** Data Visualization & Progress Features

### What was built:
Prajakta built the entire **Progress Tracker page** — the most data-rich page in the app. She integrated Recharts to display four different chart types and designed the full logging form with detailed body metrics.

She structured the 4-tab layout (Overview, Body, Workouts, Log Today), built the weight trend area chart, workout consistency bar chart, body measurements line chart, and body fat area chart. She also designed the mood tracker with emoji-based input and the activity log table.

### Key files owned:
- `fe/src/pages/Progress.jsx` — Full progress tracker with 4 tabs and charts
- `be/models/Progress.js` — Extended schema (bodyFat, chest, waist, hips, mood, notes)
- `be/controllers/progressController.js` — Updated controller for all new fields

### Technical highlights:
- Built custom `CustomTooltip` component for all Recharts charts
- 4 chart types: AreaChart (weight), BarChart (consistency), LineChart (measurements), AreaChart (body fat)
- Mood breakdown section showing count per mood type across all logs
- Stats cards: current weight, total workouts, streak, days logged
- Consistency % formula: workoutsCompleted / totalEntries × 100

---

## 5. 🔐 Soumya Smruti — Authentication UI & Axios Integration

**Role:** Frontend Auth & API Integration

### What was built:
Soumya handled the **frontend authentication flow** and the global API integration layer. She built the Login and Signup pages with full form validation and error handling, and set up the `AuthContext` for global user state management across the app.

She configured the Axios instance with the JWT token interceptor so every API request automatically includes the auth token. She also built the `ProtectedRoute` component that guards all authenticated pages and redirects unauthenticated users to login.

### Key files owned:
- `fe/src/pages/Login.jsx` — Login page with error handling + animations
- `fe/src/pages/Signup.jsx` — Signup page with all profile fields
- `fe/src/context/AuthContext.jsx` — Global auth state (login, signup, logout)
- `fe/src/api/axios.js` — Axios instance with JWT interceptor
- `fe/src/components/ProtectedRoute.jsx` — Auth guard component
- `fe/src/index.css` — Global Tailwind CSS setup

### Technical highlights:
- JWT token stored in localStorage and auto-attached to every request via Axios interceptor
- AuthContext loads user profile on app mount if token exists (persistent login)
- ProtectedRoute supports both regular auth guard and `adminOnly` prop
- Signup form handles 8 fields including goal and body type selectors
- Animated form card using Framer Motion scale-in effect

---

## 📋 Contribution Summary

| Member | Role | Primary Area |
|---|---|---|
| Nishant Kumar | Backend Lead | Server, Database, Auth API |
| Navpreet Tripathy | Core Features Dev | Workout Engine, Diet Engine, Admin |
| Sumit Thakur | Frontend Lead | UI/UX, Animations, Exercise Modal |
| Prajakta Sahoo | Data Visualization | Progress Tracker, Charts |
| Soumya Smruti | Auth & Integration | Login/Signup, Axios, AuthContext |

---

<div align="center">
  <p>Built with ❤️ by a team of 5 — MERN Stack</p>
  <p>💪 Stay consistent. Results follow.</p>
</div>
