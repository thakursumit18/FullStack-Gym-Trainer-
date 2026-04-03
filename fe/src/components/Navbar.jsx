import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { to: '/workout', label: 'Workout', icon: '🏋️' },
  { to: '/diet', label: 'Diet', icon: '🥗' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (user) {
      api.get('/premium/status')
        .then(r => setIsPremium(r.data.isPremium))
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const isPremiumPath = pathname.startsWith('/premium');

  return (
    <>
      <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-700/50 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <motion.span whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }} className="text-xl">💪</motion.span>
          <span className="text-orange-500 font-bold text-lg">GymTrainer</span>
        </Link>

        {user && (
          <>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => {
                const isActive = pathname === to;
                return (
                  <Link key={to} to={to} className="relative px-3.5 py-2 text-sm font-medium rounded-xl group">
                    <span className={`transition-all duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                      {label}
                    </span>
                    {isActive && (
                      <motion.div layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                    )}
                  </Link>
                );
              })}

              {/* Premium link */}
              <Link to="/premium"
                className={`relative px-3.5 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                  isPremiumPath
                    ? 'text-white'
                    : isPremium
                    ? 'text-yellow-400 hover:text-yellow-300'
                    : 'text-orange-400 hover:text-orange-300'
                }`}>
                <span>{isPremium ? '★' : '◆'}</span>
                <span>{isPremium ? 'Premium' : 'Upgrade'}</span>
                {isPremiumPath && (
                  <motion.div layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                )}
                {!isPremium && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                )}
              </Link>

              {user.isAdmin && (
                <Link to="/admin"
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${pathname === '/admin' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                  Admin
                </Link>
              )}
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleLogout}
                className="ml-2 px-3 py-1.5 rounded-lg text-sm bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-all">
                Logout
              </motion.button>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-700 transition-colors">
              <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }} className="block w-5 h-0.5 bg-slate-300 origin-center" />
              <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="block w-5 h-0.5 bg-slate-300" />
              <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }} className="block w-5 h-0.5 bg-slate-300 origin-center" />
            </button>
          </>
        )}
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[57px] left-0 right-0 z-40 bg-slate-900 border-b border-slate-700 px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === to ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
                <span>{icon}</span> {label}
              </Link>
            ))}

            {/* Premium mobile */}
            <Link to="/premium" onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isPremiumPath ? 'bg-orange-500 text-white' : isPremium ? 'text-yellow-400 hover:bg-slate-700' : 'text-orange-400 hover:bg-slate-700'}`}>
              <span>{isPremium ? '★' : '◆'}</span>
              {isPremium ? 'Premium Dashboard' : 'Upgrade to Premium'}
            </Link>

            {user.isAdmin && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
                🛠️ Admin
              </Link>
            )}
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
              🚪 Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
