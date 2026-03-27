import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/workout', label: 'Workout' },
  { to: '/diet', label: 'Diet' },
  { to: '/progress', label: 'Progress' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-700/50 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/dashboard" className="flex items-center gap-2">
        <motion.span whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }} className="text-xl">💪</motion.span>
        <span className="text-orange-500 font-bold text-lg">GymTrainer</span>
      </Link>

      {user && (
        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label }) => {
            const isActive = pathname === to;
            return (
              <Link key={to} to={to} className="relative px-3 py-1.5 text-sm font-medium transition-colors rounded-lg group">
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-orange-500 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          {user.isAdmin && (
            <Link to="/admin" className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${pathname === '/admin' ? 'text-white bg-orange-500' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
              Admin
            </Link>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="ml-2 px-3 py-1.5 rounded-lg text-sm bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-all"
          >
            Logout
          </motion.button>
        </div>
      )}
    </nav>
  );
}
