# 💪 GymTrainer — Personal Trainer & Diet Planner App

> A full-stack fitness web application built with the MERN stack. Designed as a low-cost alternative to personal gym trainers for beginners, college students, and budget-conscious gym users.

---

## 🚀 Live Features

### 🔐 Authentication
- JWT-based signup & login
- Secure password hashing with bcryptjs
- Protected routes — unauthenticated users redirected to login
- User profile: name, age, height, weight, goal, body type

### 🏋️ Workout Plan System
- Auto-generated **7-day weekly split** based on user goal
- 3 goal-based plans: **Lose Fat**, **Gain Muscle**, **Maintain**
- Each day targets specific muscle groups with sets & reps
- **Exercise checklist** — check off exercises as you complete them
- Checkboxes **auto-reset every day** (stored in localStorage with date key)
- Animated progress bar showing completion %
- 🎉 Completion message when all exercises are done

### 🥗 Diet Plan System
- Daily meal plan generated from user **weight + goal**
- 4 meals: Breakfast, Lunch, Snack, Dinner
- **Indian food options** — roti, dal, rice, paneer, eggs, etc.
- Budget-friendly and realistic meals
- Calorie & protein targets calculated per user

### 📊 Progress Tracker
- Log daily: **weight, body fat %, chest, waist, hips, mood, notes**
- **Recharts-powered charts**:
  - Weight trend (area chart)
  - Workout consistency (bar chart)
  - Body measurements (line chart)
  - Body fat % (area chart)
- Streak tracking with **current + longest streak**
- Workout consistency % over 30 days
- Full activity log table with mood indicators

### 🧠 Smart Dashboard
- **Smart message banner** — contextual motivation based on behavior:
  - Skipped yesterday → "Let's get back on track 💪"
  - 5+ days this week → "Incredible consistency 🔥"
  - New user → "Start your first workout 🚀"
  - Time-of-day greetings
- **Streak card** with 7-day dot visualization
- **Goal progress bar** — animated % toward target weight
- Today's workout preview + diet summary
- Quick weight log directly from dashboard

### 🎬 Animations & UX (Framer Motion)
- Page transitions — fade + slide between all routes
- Staggered card entrance animations on dashboard
- Animated streak counter with number flip
- Smooth progress bar fill animation
- Exercise checkbox scale animation
- Card hover lift effect
- Navbar animated active pill indicator (spring physics)
- Animated button tap/hover scale effect
- Day tab slide transition on workout page

### 🔍 Exercise Detail Modal
- Click any exercise to open a modal with:
  - **Real exercise image** from Wger open-source fitness library
  - Target muscle group
  - Exercise description
  - 4 form tips
  - Sets & reps display
- 45+ exercises mapped with unique verified images
- Hardcoded direct URLs — **zero API calls**, instant loading
- Fade + scale modal animation
- Close on backdrop click or Escape key

### 🛡️ Admin Panel
- Admin-only route (set `isAdmin: true` in MongoDB)
- View all workout plans by goal
- Exercise breakdown per day

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| HTTP Client | Axios |
| Routing | React Router v7 |
| Backend | Node.js + Express v5 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Dev Server | Nodemon |
| Exercise Images | Wger Open Source API |

---

## 📁 Project Structure

```
FullStack-Gym-Trainer-/
├── be/                          # Backend
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Signup, login, profile
│   │   ├── workoutController.js # Workout plan generator
│   │   ├── dietController.js    # Diet plan generator
│   │   └── progressController.js# Progress CRUD
│   ├── middleware/
│   │   └── auth.js              # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Progress.js          # Progress schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── workoutRoutes.js
│   │   ├── dietRoutes.js
│   │   └── progressRoutes.js
│   ├── .env                     # Environment variables
│   └── server.js                # Express entry point
│
└── fe/                          # Frontend
    └── src/
        ├── api/
        │   └── axios.js         # Axios instance + token interceptor
        ├── components/
        │   ├── Navbar.jsx        # Animated navbar with active pill
        │   ├── ProtectedRoute.jsx
        │   ├── PageWrapper.jsx   # Page transition wrapper
        │   ├── AnimatedButton.jsx
        │   ├── StreakCard.jsx    # Streak display + 7-day dots
        │   ├── GoalProgress.jsx  # Animated goal progress bar
        │   ├── SmartMessage.jsx  # Contextual motivation banner
        │   └── ExerciseModal.jsx # Exercise detail + image modal
        ├── context/
        │   └── AuthContext.jsx   # Global auth state
        └── pages/
            ├── Login.jsx
            ├── Signup.jsx
            ├── Dashboard.jsx
            ├── Workout.jsx
            ├── Diet.jsx
            ├── Progress.jsx
            └── Admin.jsx
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas)
- MongoDB Compass (optional, for GUI)

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

Create a `.env` file in `be/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gym-trainer
JWT_SECRET=your_secret_key_here
```

Start the backend:
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

> The frontend proxies all `/api` requests to `http://localhost:5000` via Vite config.

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

---

## 🗄️ Database Models

### User
```js
{
  name, email, password,   // required
  age, height, weight,     // numbers
  goal,                    // 'lose_fat' | 'gain_muscle' | 'maintain'
  bodyType,                // 'ectomorph' | 'mesomorph' | 'endomorph'
  isAdmin                  // boolean, default false
}
```

### Progress
```js
{
  user,              // ref to User
  date,              // 'YYYY-MM-DD'
  weight,            // kg
  bodyFat,           // %
  chest, waist, hips,// cm
  workoutCompleted,  // boolean
  mood,              // 'great'|'good'|'okay'|'tired'|'bad'
  notes              // string
}
```

---

## 🔑 Admin Access

To grant admin access, open **MongoDB Compass**, find your user document in the `gym-trainer` database and set:
```json
{ "isAdmin": true }
```

---

## 🎯 Target Users

- 🧑‍🎓 College students
- 💰 Budget-conscious gym users
- 🔰 Beginners who can't afford personal trainers
- 🏠 Home workout enthusiasts

---

## 🚫 Out of Scope (MVP)

- AI posture detection
- Video streaming
- Payment integration
- Social features
- Push notifications

---

## 📦 Dependencies

### Backend
```
express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken, nodemon
```

### Frontend
```
react, react-dom, react-router-dom, axios, framer-motion, recharts, tailwindcss
```

---

## 🙌 Credits

- Exercise images — [Wger Workout Manager](https://wger.de) (open source, CC license)
- Icons — Emoji native
- Charts — [Recharts](https://recharts.org)
- Animations — [Framer Motion](https://www.framer.com/motion)

---

<div align="center">
  <p>Built with ❤️ using the MERN Stack</p>
  <p>💪 Stay consistent. Results follow.</p>
</div>
