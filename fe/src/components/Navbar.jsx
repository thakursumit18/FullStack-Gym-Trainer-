import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const link = (to, label) => (
    <Link to={to} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${pathname === to ? 'bg-orange-500 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
      {label}
    </Link>
  );

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/dashboard" className="text-orange-500 font-bold text-xl">💪 GymTrainer</Link>
      {user && (
        <div className="flex items-center gap-2">
          {link('/dashboard', 'Dashboard')}
          {link('/workout', 'Workout')}
          {link('/diet', 'Diet')}
          {link('/progress', 'Progress')}
          {user.isAdmin && link('/admin', 'Admin')}
          <button onClick={handleLogout} className="ml-2 px-3 py-1.5 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white transition-colors">Logout</button>
        </div>
      )}
    </nav>
  );
}
