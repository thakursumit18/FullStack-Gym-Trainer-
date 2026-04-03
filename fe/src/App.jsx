import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Diet from './pages/Diet';
import Progress from './pages/Progress';
import Admin from './pages/Admin';
import Premium from './pages/Premium';
import PremiumWorkout from './pages/PremiumWorkout';
import PremiumDiet from './pages/PremiumDiet';
import PremiumSettings from './pages/PremiumSettings';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

const NO_NAVBAR = ['/', '/login', '/signup'];

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomeOrDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/workout" element={<ProtectedRoute><Workout /></ProtectedRoute>} />
        <Route path="/diet" element={<ProtectedRoute><Diet /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        {/* Premium routes */}
        <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
        <Route path="/premium/workout" element={<ProtectedRoute><PremiumWorkout /></ProtectedRoute>} />
        <Route path="/premium/diet" element={<ProtectedRoute><PremiumDiet /></ProtectedRoute>} />
        <Route path="/premium/settings" element={<ProtectedRoute><PremiumSettings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function HomeOrDashboard() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Home />;
}

function AppContent() {
  const { loading } = useAuth();
  const { pathname } = useLocation();
  const showNavbar = !NO_NAVBAR.includes(pathname);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-950">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full" />
      <p className="text-slate-500 text-sm">Loading GymTrainer...</p>
    </div>
  );

  return (
    <>
      {showNavbar && <Navbar />}
      <ScrollToTop />
      <AnimatedRoutes />
      <FloatingChat />
    </>
  );
}

function FloatingChat() {
  const { user } = useAuth();
  if (!user) return null;
  return <ChatBot />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
