# 💪 GymTrainer — Personal Trainer & Diet Planner App

> A full-stack fitness web application built with the MERN stack. Designed as a low-cost alternative to personal gym trainers for beginners, college students, and budget-conscious gym users.

---

## 🌐 Live Demo

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://gymtrainer.vercel.app |
| Backend | Render | https://gymtrainer-backend.onrender.com |
| Database | MongoDB Atlas | cluster0.xcucpuc.mongodb.net |

---

## 🚀 Features

### 🏠 Landing Page
- Full-screen parallax hero with animated glow orbs
- Auto-advancing feature slideshow (4 slides)
- Animated motivational quote ticker
- Photo gallery with hover effects
- Scroll-triggered fade-up animations (Framer Motion)
- Stats counter animation
- How it works — 3 step guide
- Target users section
- Final CTA section with footer

### 🔐 Authentication
- JWT-based signup & login
- Secure password hashing with bcryptjs
- Protected routes — unauthenticated users redirected to home
- Auto-logout on token expiry (401 interceptor)
- User profile: name, age, height, weight, goal, body type
- Password minimum 6 characters validation

### 🏋️ Workout Plan System
- Auto-generated 7-day weekly split based on user goal
- 3 goal-based plans: Lose Fat, Gain Muscle, Maintain
- Each day targets specific muscle groups with sets & reps
- Exercise checklist — check off exercises as you complete them
- Checkboxes auto-reset every day (localStorage with date key)
- Animated progress bar showing completion %
- Completion message when all exercises are done
- Click any exercise → Exercise Detail Modal

### 🔍 Exercise Detail Modal
- Real exercise images from Wger open-source fitness library
- 45+ exercises mapped with unique verified image URLs
- Zero API calls — hardcoded direct URLs for instant loading
- Target muscle group, description, 4 form tips
- Fade + scale spring animation, close on backdrop/Escape

### 🥗 Diet Plan System
- Daily meal plan from user weight + goal + body type
- 4 meals: Breakfast, Lunch, Snack, Dinner
- Indian food options — roti, dal, rice, paneer, eggs, etc.
- Budget-friendly and realistic meals
- Calorie & protein targets calculated per user

### 📊 Progress Tracker (5 tabs)
- **Overview** — Weight trend area chart + workout consistency bar chart
- **Body** — BMI calculator with animated scale bar + Body Fat % chart + measurements line chart
- **Workouts** — Mood breakdown + full activity log table
- **Log Today** — weight, body fat %, chest, waist, hips, mood picker, notes, workout checkbox
- **Feedback** — Star rating, category, goal satisfaction, what worked, improvement, usage frequency, recommend

### 🧠 Smart Dashboard
- Smart message banner — 7 contextual motivations based on behavior
- Streak card with 7-day dot visualization + longest streak
- Goal progress bar — animated % toward target weight
- Stats row: current weight, workouts done, today status
- Today's workout preview + diet summary
- Quick weight log directly from dashboard

### 📈 BMI Calculator
- Auto-calculated from user height + latest logged weight
- Animated color-coded scale bar (Blue → Green → Yellow → Red)
- Moving pointer showing exact BMI position
- Category: Underweight / Normal / Overweight / Obese

### 🤖 AI FitBot Chatbot
- Powered by Google Gemini 2.5 Flash
- Answers all fitness, diet, body composition questions
- Speaks English + Hinglish naturally
- Personalized using user profile (weight, height, goal, age)
- Floating button with pulse animation
- 6 quick prompt buttons
- Full chat history maintained
- Typing indicator (3 bouncing dots)

### 💬 Feedback System
- Stored in MongoDB with full user context
- Fields: rating, category, goal satisfaction, what worked, improvement, usage frequency, would recommend
- Admin can view all feedback via API

### 🎬 Animations (Framer Motion)
- Page transitions — fade + slide between all routes
- Staggered card entrance on dashboard
- Animated streak counter with number flip
- Smooth progress bar fill animation
- Exercise checkbox scale animation
- Card hover lift effect
- Navbar animated active pill (spring physics)
- Scroll-triggered fade-up on home page
- Parallax hero scroll effect

### 🛡️ Security
- Helmet security headers
- Rate limiting — 100 req/15min general, 10 for auth, 15/min for chat
- Body size limit — 10kb max payload
- CORS configured for production
- Input sanitization on signup/login
- Strong JWT secret

### 📱 Mobile Responsive
- Hamburger menu with animated open/close
- Responsive grids on all pages
- Touch-friendly checkboxes and buttons

### 🛠️ Admin Panel
- Admin-only route (set `isAdmin: true` in MongoDB)
- View all workout plans by goal
- Exercise breakdown per day

---

## 🧱 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React + Vite | 19.x / 8.x |
| Styling | Tailwind CSS | v4 |
| Animations | Framer Motion | 12.x |
| Charts | Recharts | 3.x |
| HTTP Client | Axios | 1.x |
| Routing | React Router | v7 |
| Backend | Node.js + Express | v5 |
| Database | MongoDB + Mongoose | 9.x |
| Auth | JWT + bcryptjs | — |
| AI | Google Gemini 2.5 Flash | — |
| Security | Helmet + express-rate-limit | — |
| Dev Server | Nodemon | 3.x |
| Exercise Images | Wger Open Source API | — |

---

## 📁 Project Structure

```
FullStack-Gym-Trainer-/
├── be/                              # Backend
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js        # Signup, login, profile
│   │   ├── workoutController.js     # Workout plan generator
│   │   ├── dietController.js        # Diet plan generator
│   │   ├── progressController.js    # Progress CRUD
│   │   ├── feedbackController.js    # Feedback collection
│   │   └── chatController.js        # Gemini AI chatbot
│   ├── middleware/
│   │   └── auth.js                  # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Progress.js              # Progress schema
│   │   └── Feedback.js              # Feedback schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── workoutRoutes.js
│   │   ├── dietRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── feedbackRoutes.js
│   │   └── chatRoutes.js
│   ├── .env.example                 # Environment variable template
│   └── server.js                    # Express entry point
│
└── fe/                              # Frontend
    └── src/
        ├── api/
        │   └── axios.js             # Axios instance + interceptors
        ├── components/
        │   ├── Navbar.jsx            # Animated navbar + hamburger
        │   ├── ProtectedRoute.jsx    # Auth guard
        │   ├── PageWrapper.jsx       # Page transition wrapper
        │   ├── AnimatedButton.jsx    # Reusable animated button
        │   ├── ScrollToTop.jsx       # Scroll reset on route change
        │   ├── StreakCard.jsx        # Streak + 7-day dots
        │   ├── GoalProgress.jsx      # Animated goal progress bar
        │   ├── SmartMessage.jsx      # Contextual motivation banner
        │   ├── ExerciseModal.jsx     # Exercise detail + image modal
        │   └── ChatBot.jsx           # AI FitBot floating chatbot
        ├── context/
        │   └── AuthContext.jsx       # Global auth state
        └── pages/
            ├── Home.jsx              # Landing page
            ├── Login.jsx
            ├── Signup.jsx
            ├── Dashboard.jsx
            ├── Workout.jsx
            ├── Diet.jsx
            ├── Progress.jsx
            ├── Admin.jsx
            └── NotFound.jsx          # 404 page
```

---

## ⚙️ Getting Started (Local)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/FullStack-Gym-Trainer-.git
cd FullStack-Gym-Trainer-
```

### 2. Setup Backend
```bash
cd be
npm install
```

Create `.env` from `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gym-trainer
JWT_SECRET=your_strong_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

> Get free Gemini API key from: https://aistudio.google.com/app/apikey

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd fe
npm install
npm run dev
```

### 4. Open the app
```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |

### Workout
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/workout` | Get plan + today's workout (protected) |
| GET | `/api/workout/all` | Get all plans (admin only) |
| PUT | `/api/workout/:goal/:dayIndex` | Update workout day (admin only) |

### Diet
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/diet` | Get personalized diet plan (protected) |

### Progress
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/progress` | Log/update today's progress (protected) |
| GET | `/api/progress` | Get last 60 entries (protected) |

### Feedback
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/feedback` | Submit feedback (protected) |
| GET | `/api/feedback/mine` | Get own feedback (protected) |
| GET | `/api/feedback/all` | Get all feedback (admin only) |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send message to FitBot AI (protected) |

---

## 🗄️ Database Models

### User
```js
{ name, email, password, age, height, weight,
  goal: 'lose_fat' | 'gain_muscle' | 'maintain',
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph',
  isAdmin: Boolean }
```

### Progress
```js
{ user, date, weight, bodyFat, chest, waist, hips,
  workoutCompleted, mood: 'great'|'good'|'okay'|'tired'|'bad', notes }
```

### Feedback
```js
{ user, rating(1-5), category, goalSatisfaction(1-5),
  whatWorked, improvement, wouldRecommend, usageFrequency }
```

---

## 🔑 Admin Access

In MongoDB Atlas, find your user document and set:
```json
{ "isAdmin": true }
```

---

## 🚀 Deployment

| Part | Platform | Config |
|---|---|---|
| Frontend | Vercel | Root: `fe`, Build: `npm run build`, Output: `dist` |
| Backend | Render | Root: `be`, Start: `npm start` |
| Database | MongoDB Atlas | Free M0 cluster |

### Vercel Environment Variables
```
VITE_API_URL = https://your-render-app.onrender.com/api
```

### Render Environment Variables
```
MONGO_URI     = mongodb+srv://...
JWT_SECRET    = your_secret
GEMINI_API_KEY = your_key
CLIENT_URL    = https://your-vercel-app.vercel.app
NODE_ENV      = production
```

---

## 🎯 Target Users

- 🧑‍🎓 College students
- 💰 Budget-conscious gym users
- 🔰 Beginners who can't afford personal trainers
- 🏠 Home workout enthusiasts

---

## 📦 Dependencies

### Backend
```
express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken,
helmet, express-rate-limit, @google/generative-ai, nodemon
```

### Frontend
```
react, react-dom, react-router-dom, axios,
framer-motion, recharts, tailwindcss
```

---

## 🙌 Credits

- Exercise images — [Wger Workout Manager](https://wger.de) (open source, CC license)
- AI — [Google Gemini](https://ai.google.dev) (Gemini 2.5 Flash)
- Charts — [Recharts](https://recharts.org)
- Animations — [Framer Motion](https://www.framer.com/motion)
- Photos — [Unsplash](https://unsplash.com) (free license)

---

<div align="center">
  <p>Built with ❤️ by Team GymTrainer using the MERN Stack</p>
  <p>💪 Stay consistent. Results follow.</p>
</div>
