# GymTrainer — Project Report

**Project Title:** GymTrainer — Personal Trainer & Diet Planner App
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)
**Type:** Full-Stack Web Application
**Deployment:** Vercel (Frontend) + Render (Backend) + MongoDB Atlas (Database)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Objectives](#2-objectives)
3. [Team Members](#3-team-members)
4. [System Architecture](#4-system-architecture)
5. [Technology Stack](#5-technology-stack)
6. [Database Design](#6-database-design)
7. [Backend Development](#7-backend-development)
8. [Frontend Development](#8-frontend-development)
9. [Features](#9-features)
10. [Security Implementation](#10-security-implementation)
11. [Deployment](#11-deployment)
12. [Challenges & Solutions](#12-challenges--solutions)
13. [Project Statistics](#13-project-statistics)
14. [Future Scope](#14-future-scope)
15. [Conclusion](#15-conclusion)

---

## 1. Introduction

GymTrainer is a full-stack fitness web application designed as a low-cost alternative to personal gym trainers. The application provides structured daily workout routines, personalized diet plans, progress tracking, BMI calculation, and an AI-powered fitness chatbot — all completely free of charge.

The application targets beginners, college students, and budget-conscious gym users who cannot afford personal trainers but still want structured, personalized fitness guidance.

---

## 2. Objectives

- Provide personalized workout plans based on user fitness goals
- Generate budget-friendly Indian diet plans with calorie and protein targets
- Track user progress with visual charts and analytics
- Calculate BMI and body fat percentage with visual indicators
- Integrate an AI chatbot for 24/7 fitness guidance in English and Hinglish
- Deploy a production-ready, secure, and mobile-responsive web application

---

## 3. Team Members

| Name | Role | Responsibility |
|---|---|---|
| Nishant Kumar | Backend Lead + DevOps | Server, Auth, Security, MongoDB Atlas, Render Deployment |
| Navpreet Tripathy | Core Features Developer | Workout Engine, Diet Engine, Admin Panel, Feedback API |
| Sumit Thakur | Frontend Lead + AI Engineer | UI/UX, Animations,Home page,FitBot AI, Exercise Modal |
| Prajakta Sahoo | Data Visualization Engineer | Progress Tracker, Charts, BMI Calculator, Body Fat Tracker |
| Soumya Smruti | Auth + Integration + Deployment | Login/Signup, Axios, AuthContext, Vercel Deployment |

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        USER BROWSER                      │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│              VERCEL — React + Vite Frontend              │
│  Home | Login | Signup | Dashboard | Workout | Diet      │
│  Progress | Admin | NotFound                             │
└─────────────────────────┬───────────────────────────────┘
                          │ REST API (HTTPS)
                          ▼
┌─────────────────────────────────────────────────────────┐
│              RENDER — Node.js + Express Backend          │
│  Auth | Workout | Diet | Progress | Feedback | Chat      │
│  Helmet | Rate Limiting | CORS | JWT Middleware          │
└──────────┬──────────────┬──────────────┬────────────────┘
           │              │              │
           ▼              ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │   Google     │  │    Wger      │
│    Atlas     │  │  Gemini AI   │  │   Images     │
│  (Database)  │  │  (Chatbot)   │  │  (Exercise)  │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Data Flow

```
User Action → React Component → Axios (with JWT)
→ Express Route → Middleware (auth/rate limit)
→ Controller → MongoDB / Gemini API
→ Response → React State Update → UI Re-render
```

---

## 5. Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI library |
| Vite | 8.x | Build tool and dev server |
| Tailwind CSS | v4 | Utility-first styling |
| Framer Motion | 12.x | Animations and transitions |
| Recharts | 3.x | Data visualization charts |
| Axios | 1.x | HTTP client with interceptors |
| React Router | v7 | Client-side routing |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express.js | v5 | Web framework |
| MongoDB | — | NoSQL database |
| Mongoose | 9.x | MongoDB ODM |
| bcryptjs | 3.x | Password hashing |
| jsonwebtoken | 9.x | JWT authentication |
| Helmet | 8.x | Security headers |
| express-rate-limit | 8.x | API rate limiting |
| dotenv | 17.x | Environment variables |
| Nodemon | 3.x | Development auto-reload |

### External Services

| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database hosting |
| Google Gemini 2.5 Flash | AI chatbot responses |
| Wger Workout Manager | Exercise images (open source) |
| Unsplash | Home page fitness photos |
| Vercel | Frontend hosting |
| Render | Backend hosting |

---

## 6. Database Design

### 6.1 User Model

```
Collection: users

Field         Type        Required    Description
─────────────────────────────────────────────────────
_id           ObjectId    Auto        Primary key
name          String      Yes         Full name
email         String      Yes         Unique email
password      String      Yes         Bcrypt hashed
age           Number      No          User age
height        Number      No          Height in cm
weight        Number      No          Weight in kg
goal          String      No          lose_fat | gain_muscle | maintain
bodyType      String      No          ectomorph | mesomorph | endomorph
isAdmin       Boolean     No          Default: false
createdAt     Date        Auto        Timestamp
updatedAt     Date        Auto        Timestamp
```

### 6.2 Progress Model

```
Collection: progresses

Field              Type        Required    Description
──────────────────────────────────────────────────────────
_id                ObjectId    Auto        Primary key
user               ObjectId    Yes         Ref: User
date               String      Yes         YYYY-MM-DD format
weight             Number      No          Body weight in kg
bodyFat            Number      No          Body fat percentage
chest              Number      No          Chest measurement cm
waist              Number      No          Waist measurement cm
hips               Number      No          Hips measurement cm
workoutCompleted   Boolean     No          Default: false
mood               String      No          great|good|okay|tired|bad
notes              String      No          Daily notes
createdAt          Date        Auto        Timestamp
```

### 6.3 Feedback Model

```
Collection: feedbacks

Field              Type        Required    Description
──────────────────────────────────────────────────────────
_id                ObjectId    Auto        Primary key
user               ObjectId    Yes         Ref: User
rating             Number      Yes         1 to 5 stars
category           String      Yes         overall_app | workout_plan |
                                           diet_plan | progress_tracking | ui_ux
goalSatisfaction   Number      No          1 to 5 scale
whatWorked         String      No          Max 500 characters
improvement        String      No          Max 500 characters
wouldRecommend     Boolean     No          Yes or No
usageFrequency     String      No          daily | few_times_week |
                                           weekly | rarely
createdAt          Date        Auto        Timestamp
```

---

## 7. Backend Development

### 7.1 Project Structure

```
be/
├── config/
│   └── db.js                 MongoDB Atlas connection
├── controllers/
│   ├── authController.js     Signup, login, profile CRUD
│   ├── workoutController.js  Workout plan generator
│   ├── dietController.js     Diet plan generator
│   ├── progressController.js Progress log and retrieval
│   ├── feedbackController.js Feedback submit and retrieval
│   └── chatController.js     Gemini AI integration
├── middleware/
│   └── auth.js               JWT protect + adminOnly
├── models/
│   ├── User.js
│   ├── Progress.js
│   └── Feedback.js
├── routes/
│   ├── authRoutes.js
│   ├── workoutRoutes.js
│   ├── dietRoutes.js
│   ├── progressRoutes.js
│   ├── feedbackRoutes.js
│   └── chatRoutes.js
├── .env.example
└── server.js
```

### 7.2 API Endpoints

```
AUTH
POST   /api/auth/signup          Register new user
POST   /api/auth/login           Login and get JWT token
GET    /api/auth/profile         Get current user profile (protected)
PUT    /api/auth/profile         Update user profile (protected)

WORKOUT
GET    /api/workout              Get weekly plan + today's workout (protected)
GET    /api/workout/all          Get all 3 plans (admin only)
PUT    /api/workout/:goal/:day   Update a workout day (admin only)

DIET
GET    /api/diet                 Get personalized daily meal plan (protected)

PROGRESS
POST   /api/progress             Log or update today's progress (protected)
GET    /api/progress             Get last 60 entries (protected)

FEEDBACK
POST   /api/feedback             Submit feedback (protected)
GET    /api/feedback/mine        Get own feedback (protected)
GET    /api/feedback/all         Get all feedback (admin only)

CHAT
POST   /api/chat                 Send message to FitBot AI (protected)
```

### 7.3 Workout Plan Logic

Three complete weekly plans are hardcoded in the controller:

```
Goal: lose_fat
  Mon: Chest + Triceps  |  Tue: Back + Biceps  |  Wed: Cardio + Core
  Thu: Shoulders        |  Fri: Legs           |  Sat: HIIT Cardio
  Sun: Rest Day

Goal: gain_muscle
  Mon: Chest + Triceps  |  Tue: Back + Biceps  |  Wed: Legs
  Thu: Shoulders+Traps  |  Fri: Chest+Back Vol |  Sat: Arms + Core
  Sun: Rest Day

Goal: maintain
  Mon: Full Body A      |  Tue: Cardio         |  Wed: Full Body B
  Thu: Active Recovery  |  Fri: Full Body C    |  Sat: Cardio + Core
  Sun: Rest Day
```

### 7.4 Diet Plan Logic

```
Calorie Calculation:
  Lose Fat    → weight × 24 − 500 kcal
  Gain Muscle → weight × 24 + 500 kcal
  Maintain    → weight × 24 kcal

Protein Targets:
  Lose Fat    → weight × 2.0 g
  Gain Muscle → weight × 2.2 g
  Maintain    → weight × 1.6 g
```

### 7.5 AI Chatbot Integration

```
Model:    Google Gemini 2.5 Flash
Endpoint: https://generativelanguage.googleapis.com/v1/models/
          gemini-2.5-flash:generateContent
Method:   Direct HTTPS (bypasses SDK version limitations)

System Prompt covers:
  - Workouts, diet, body composition, fitness goals
  - Recovery, beginner guidance, motivation
  - English + Hinglish language mixing
  - User profile personalization
  - Medical disclaimer for injuries
```

---

## 8. Frontend Development

### 8.1 Project Structure

```
fe/src/
├── api/
│   └── axios.js              Axios instance + JWT interceptor
├── components/
│   ├── Navbar.jsx            Sticky nav + mobile hamburger
│   ├── ProtectedRoute.jsx    Auth guard component
│   ├── PageWrapper.jsx       Page transition wrapper
│   ├── AnimatedButton.jsx    Reusable animated button
│   ├── ScrollToTop.jsx       Scroll reset on route change
│   ├── StreakCard.jsx        Streak + 7-day dot visualization
│   ├── GoalProgress.jsx      Animated goal progress bar
│   ├── SmartMessage.jsx      Contextual motivation banner
│   ├── ExerciseModal.jsx     Exercise detail + image modal
│   └── ChatBot.jsx           AI FitBot floating chatbot
├── context/
│   └── AuthContext.jsx       Global auth state management
└── pages/
    ├── Home.jsx              Landing page
    ├── Login.jsx             Login form
    ├── Signup.jsx            Signup with profile fields
    ├── Dashboard.jsx         Main dashboard
    ├── Workout.jsx           Weekly workout plan
    ├── Diet.jsx              Daily meal plan
    ├── Progress.jsx          5-tab progress tracker
    ├── Admin.jsx             Admin panel
    └── NotFound.jsx          Custom 404 page
```

### 8.2 Routing Structure

```
/              → Home page (guests) or Dashboard (logged in)
/login         → Login page
/signup        → Signup page
/dashboard     → Dashboard (protected)
/workout       → Workout page (protected)
/diet          → Diet page (protected)
/progress      → Progress tracker (protected)
/admin         → Admin panel (protected + admin only)
*              → 404 Not Found page
```

### 8.3 State Management

```
AuthContext (Global)
  ├── user          Current logged-in user object
  ├── loading       Auth check loading state
  ├── login()       Login and store JWT
  ├── signup()      Signup and store JWT
  ├── logout()      Clear token and redirect home
  └── updateUser()  Update user in state

Local State (per page)
  ├── API data      workout, diet, progress entries
  ├── Form state    input values
  ├── UI state      loading, error, saved flags
  └── Tab state     active tab selection
```

### 8.4 Animation System

```
Framer Motion Usage:

PageWrapper       → fade + slide on every route change
Navbar            → layoutId spring active pill
Home Hero         → parallax useScroll + useTransform
Home Sections     → useInView scroll-triggered fade-up
Home Counter      → animated number counting
Home Slideshow    → AnimatePresence fade transitions
Dashboard Cards   → staggered entrance (i * 0.08s delay)
StreakCard        → AnimatePresence number flip
GoalProgress      → motion.div width fill animation
ExerciseModal     → scale + fade spring animation
ChatBot           → spring stiffness 300 damping 28
Exercise Checkbox → scale pop on check
Button            → whileTap scale + whileHover scale
```

---

## 9. Features

### 9.1 Home Page
- Parallax hero with animated background orbs
- Feature slideshow (4 slides, auto-advance 4s)
- Motivational quote ticker (5 quotes, auto-advance 3.5s)
- Photo gallery with hover effects
- Animated stats counters
- 3-step how it works guide
- Target users section
- CTA section with footer

### 9.2 Authentication
- JWT token (7-day expiry)
- bcryptjs password hashing (10 salt rounds)
- Auto-logout on 401 response
- Redirect to home on logout
- Password minimum 6 characters

### 9.3 Dashboard
- Smart contextual message (7 states)
- Streak card with 7-day visualization
- Goal progress bar (animated fill)
- Today's workout preview
- Today's diet summary
- Quick weight log

### 9.4 Workout Page
- 7-day tab navigation
- Per-exercise checkboxes (daily reset)
- Animated progress bar
- Exercise Detail Modal with images

### 9.5 Diet Page
- Daily calorie and protein targets
- 4 meal cards with Indian food items
- Hover lift animations

### 9.6 Progress Page (5 Tabs)
- Weight trend area chart
- Workout consistency bar chart
- BMI calculator with scale bar
- Body fat % area chart
- Body measurements line chart
- Mood breakdown
- Activity log table
- Full daily log form
- Feedback submission form

### 9.7 AI FitBot
- Floating button (bottom-right)
- Chat window with history
- Typing indicator
- 6 quick prompts
- English + Hinglish responses
- User profile personalization

### 9.8 Admin Panel
- View all 3 workout plans
- Exercise breakdown per day

---

## 10. Security Implementation

| Layer | Measure | Detail |
|---|---|---|
| Password | bcryptjs hashing | 10 salt rounds |
| Authentication | JWT tokens | 7-day expiry |
| Headers | Helmet.js | XSS, CSRF, clickjacking protection |
| Rate Limiting | express-rate-limit | 100/15min general, 10/15min auth, 15/min chat |
| Payload | Body size limit | 10kb maximum |
| CORS | Origin whitelist | Only allowed domains |
| Input | Sanitization | Trim + lowercase on auth |
| Token | Auto-expiry | 401 interceptor clears token |
| Routes | Protected middleware | JWT verify on all private routes |
| Admin | Role check | isAdmin flag in database |

---

## 11. Deployment

### 11.1 Infrastructure

```
Frontend  →  Vercel     (CDN, auto-deploy from GitHub)
Backend   →  Render     (Node.js web service)
Database  →  MongoDB Atlas  (M0 Free cluster, cloud)
AI        →  Google Gemini  (API key based)
```

### 11.2 Environment Variables

**Backend (Render)**
```
MONGO_URI      MongoDB Atlas connection string
JWT_SECRET     Strong random secret key
GEMINI_API_KEY Google Gemini API key
CLIENT_URL     Vercel frontend URL
NODE_ENV       production
```

**Frontend (Vercel)**
```
VITE_API_URL   Render backend URL + /api
```

### 11.3 Build Configuration

**Frontend (Vite)**
```
Build Command   : npm run build
Output Dir      : dist
Root Directory  : fe
Code Splitting  : vendor / charts / motion chunks
```

**Backend (Render)**
```
Build Command   : npm install
Start Command   : npm start
Root Directory  : be
```

---

## 12. Challenges & Solutions

| # | Challenge | Solution |
|---|---|---|
| 1 | bcryptjs v3 removed `next` from pre-save hook | Removed `next` parameter, used plain async function |
| 2 | Gemini SDK v0.24.1 using deprecated v1beta API | Switched to direct HTTPS calls to v1 API |
| 3 | `gemini-1.5-flash` model not found | Listed available models, found `gemini-2.5-flash` works |
| 4 | MongoDB Atlas `@` in password breaking URI | URL-encoded `@` as `%40` in connection string |
| 5 | Vite 8 `manualChunks` object syntax error | Changed to function syntax for rolldown compatibility |
| 6 | Wger API slow + same image for all exercises | Hardcoded 45+ unique verified direct image URLs |
| 7 | Logout redirecting to login instead of home | Fixed in Navbar, ProtectedRoute, and Axios interceptor |
| 8 | Render not reading `.env` file | Added all env vars manually in Render dashboard |
| 9 | Gemini API quota exceeded on free tier | Created new API key, switched to gemini-2.5-flash |
| 10 | Screen compression from CSS z-index conflict | Fixed noise overlay z-index and body width |

---

## 13. Project Statistics

| Metric | Value |
|---|---|
| Total files created | 35+ |
| Backend API endpoints | 13 |
| Frontend pages | 9 |
| Reusable components | 10 |
| Database models | 3 |
| Workout plans | 3 goals × 7 days = 21 unique days |
| Exercises covered | 45+ |
| Exercise images | 45+ unique Wger URLs |
| Chart types used | 4 (Area, Bar, Line, Area) |
| Smart message states | 7 |
| Animation types | 10+ |
| Estimated lines of code | 4000+ |
| Build time | ~600ms |
| Gzip bundle size | ~267kb total |

---

## 14. Future Scope

| Feature | Description |
|---|---|
| Push Notifications | Workout reminders via browser notifications |
| Video Demonstrations | Exercise video guides |
| Social Features | Share progress, follow friends |
| Payment Integration | Premium plans with Razorpay |
| AI Posture Detection | Camera-based form correction |
| Wearable Integration | Fitbit, Apple Watch sync |
| Multilingual Support | Hindi, Tamil, Telugu |
| Offline Mode | Service workers for offline access |
| Meal Logging | Track actual food consumed |
| Personal Records | Track PRs for each exercise |

---

## 15. Conclusion

GymTrainer successfully delivers a complete, production-ready fitness platform as a free alternative to personal trainers. The application covers the full fitness journey — from discovering the app on the landing page, creating a personalized profile, following structured workout and diet plans, tracking progress with visual charts, and getting 24/7 AI guidance through FitBot.

The project demonstrates a well-architected MERN stack application with:
- Proper security implementation (Helmet, JWT, rate limiting)
- Mobile-first responsive design
- Smooth animations and professional UX
- Real-time AI integration via Google Gemini
- Cloud deployment on Vercel + Render + MongoDB Atlas
- Clean code structure with separation of concerns

The application is live, deployed, and ready for real users.

---

**Submitted by:**

| Name | Role |
|---|---|
| Nishant Kumar | Backend Lead + DevOps |
| Navpreet Tripathy | Core Features Developer |
| Sumit Thakur | Frontend Lead + AI Engineer |
| Prajakta Sahoo | Data Visualization Engineer |
| Soumya Smruti | Auth + Integration + Deployment |

---

*Built with ❤️ using the MERN Stack*
*💪 Stay consistent. Results follow.*
