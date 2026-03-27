import { motion, AnimatePresence } from 'framer-motion';

function calcStreaks(entries) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  let current = 0, longest = 0, temp = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // current streak — must include today or yesterday to be active
  const hasToday = sorted[0]?.date === today && sorted[0]?.workoutCompleted;
  const hasYesterday = sorted[0]?.date === yesterday && sorted[0]?.workoutCompleted;
  if (hasToday || hasYesterday) {
    for (const e of sorted) {
      if (e.workoutCompleted) current++;
      else break;
    }
  }

  // longest streak
  for (const e of sorted) {
    if (e.workoutCompleted) { temp++; longest = Math.max(longest, temp); }
    else temp = 0;
  }

  return { current, longest };
}

export default function StreakCard({ entries }) {
  const { current, longest } = calcStreaks(entries);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Current Streak</p>
          <div className="flex items-end gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={current}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-black text-white"
              >
                {current}
              </motion.span>
            </AnimatePresence>
            <span className="text-slate-300 text-sm mb-1">days</span>
          </div>
          <p className="text-slate-500 text-xs mt-1">Best: <span className="text-orange-400 font-semibold">{longest} days</span></p>
        </div>
        <motion.div
          animate={{ rotate: current > 0 ? [0, -10, 10, -5, 5, 0] : 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-5xl select-none"
        >
          {current >= 7 ? '🏆' : current >= 3 ? '🔥' : current > 0 ? '💪' : '😴'}
        </motion.div>
      </div>

      {/* Streak dots — last 7 days */}
      <div className="flex gap-1.5 mt-4">
        {Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0];
          const entry = entries.find(e => e.date === d);
          const done = entry?.workoutCompleted;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex-1 h-2 rounded-full ${done ? 'bg-orange-500' : 'bg-slate-700'}`}
              title={d}
            />
          );
        })}
      </div>
      <p className="text-slate-600 text-xs mt-1.5">Last 7 days</p>
    </motion.div>
  );
}
