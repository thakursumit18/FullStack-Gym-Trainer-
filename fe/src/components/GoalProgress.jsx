import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function GoalProgress({ entries }) {
  const { user } = useAuth();
  if (!user) return null;

  const { goal, weight: startWeight } = user;
  const weights = entries.filter(e => e.weight).map(e => e.weight);
  const currentWeight = weights[weights.length - 1] || startWeight;

  let targetWeight, label, description;
  if (goal === 'lose_fat') {
    targetWeight = startWeight * 0.9;
    label = 'Fat Loss Goal';
    description = `Target: ${targetWeight.toFixed(1)} kg`;
  } else if (goal === 'gain_muscle') {
    targetWeight = startWeight * 1.08;
    label = 'Muscle Gain Goal';
    description = `Target: ${targetWeight.toFixed(1)} kg`;
  } else {
    label = 'Maintenance Goal';
    description = 'Stay within ±2 kg of your start weight';
    const diff = Math.abs(currentWeight - startWeight);
    const pct = Math.max(0, Math.round((1 - diff / 2) * 100));
    return <ProgressBar label={label} description={description} pct={Math.min(100, pct)} color="blue" note={`${diff.toFixed(1)} kg from start`} />;
  }

  if (!startWeight || !currentWeight) return null;

  const totalChange = Math.abs(targetWeight - startWeight);
  const achieved = Math.abs(currentWeight - startWeight);
  const pct = Math.min(100, Math.round((achieved / totalChange) * 100));
  const color = goal === 'lose_fat' ? 'orange' : 'green';

  return (
    <ProgressBar
      label={label}
      description={description}
      pct={pct}
      color={color}
      note={`Current: ${currentWeight} kg · Start: ${startWeight} kg`}
    />
  );
}

function ProgressBar({ label, description, pct, color, note }) {
  const colors = {
    orange: 'from-orange-500 to-red-500',
    green: 'from-green-500 to-emerald-400',
    blue: 'from-blue-500 to-cyan-400',
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-white font-semibold">{label}</p>
          <p className="text-slate-500 text-xs mt-0.5">{description}</p>
        </div>
        <motion.div
          key={pct}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-2xl font-black ${color === 'orange' ? 'text-orange-400' : color === 'green' ? 'text-green-400' : 'text-blue-400'}`}
        >
          {pct}%
        </motion.div>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={`h-3 rounded-full bg-gradient-to-r ${colors[color]}`}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-slate-500 text-xs">{note}</p>
        {pct >= 100 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-green-400 font-semibold">
            🎉 Goal Reached!
          </motion.span>
        )}
      </div>
    </div>
  );
}
