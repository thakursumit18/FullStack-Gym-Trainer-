import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-8xl mb-4">🏋️</div>
        <h1 className="text-6xl font-black text-orange-500 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-slate-400 text-sm mb-8 max-w-sm">
          Looks like this page skipped leg day and went missing. Let's get you back on track!
        </p>
        <Link to="/dashboard">
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Back to Dashboard →
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
