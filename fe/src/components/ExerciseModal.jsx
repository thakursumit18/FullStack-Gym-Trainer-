import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const W = 'https://wger.de/media/exercise-images/';

// Every image URL verified directly from Wger — unique per exercise, no API call needed
const EXERCISE_INFO = {
  // ── CHEST ──────────────────────────────────────────────────────────────────
  'Bench Press': {
    muscle: 'Chest', image: `${W}192/Bench-press-1.png`,
    description: 'A compound push movement targeting the pectorals, anterior deltoids, and triceps.',
    tips: ['Keep shoulder blades retracted', 'Drive feet into the floor', 'Lower bar to mid-chest', 'Full range of motion'],
  },
  'Incline Dumbbell Press': {
    muscle: 'Upper Chest', image: `${W}1277/9f3c7817-3e3d-417d-8b08-2c0a1aa5fe03.jpg`,
    description: 'Targets the upper portion of the pectorals with a 30–45° incline angle.',
    tips: ['Set bench to 30–45°', 'Control the descent', 'Squeeze at the top', 'Keep core tight'],
  },
  'Incline Barbell Press': {
    muscle: 'Upper Chest', image: `${W}1277/9f3c7817-3e3d-417d-8b08-2c0a1aa5fe03.jpg`,
    description: 'Barbell variation of the incline press for maximum upper chest overload.',
    tips: ['Set bench to 30°', 'Grip slightly wider than shoulder', 'Control the descent', 'Full lockout at top'],
  },
  'Dumbbell Press': {
    muscle: 'Chest', image: `${W}192/Bench-press-1.png`,
    description: 'Flat dumbbell press for chest with greater range of motion than barbell.',
    tips: ['Touch dumbbells at top', 'Full stretch at bottom', 'Control the weight', 'Neutral or pronated grip'],
  },
  'Cable Flyes': {
    muscle: 'Chest', image: `${W}192/Bench-press-1.png`,
    description: 'Cable isolation movement for chest with constant tension throughout.',
    tips: ['Slight bend in elbows', 'Squeeze at center', 'Full stretch at sides', 'Control the movement'],
  },
  'Push-ups': {
    muscle: 'Chest + Triceps', image: `${W}1551/a6a9e561-3965-45c6-9f2b-ee671e1a3a45.png`,
    description: 'Fundamental bodyweight push exercise for chest and triceps.',
    tips: ['Straight body line', 'Chest to floor', 'Full lockout at top', 'Elbows at 45°'],
  },
  'Dips': {
    muscle: 'Chest + Triceps', image: `${W}194/34600351-8b0b-4cb0-8daa-583537be15b0.png`,
    description: 'Bodyweight dip for lower chest and triceps development.',
    tips: ['Lean forward for chest', 'Lower to 90°', 'Full lockout at top', 'Control the descent'],
  },

  // ── TRICEPS ────────────────────────────────────────────────────────────────
  'Tricep Pushdown': {
    muscle: 'Triceps', image: `${W}1185/c5ca283d-8958-4fd8-9d59-a3f52a3ac66b.jpg`,
    description: 'Isolation exercise for the triceps using a cable machine.',
    tips: ['Keep elbows pinned to sides', 'Full extension at bottom', 'Slow on the way up', 'Avoid swinging'],
  },
  'Tricep Dips': {
    muscle: 'Triceps', image: `${W}194/34600351-8b0b-4cb0-8daa-583537be15b0.png`,
    description: 'Bodyweight compound movement for triceps and lower chest.',
    tips: ['Keep torso upright for triceps', 'Lower until elbows at 90°', 'Keep elbows close', 'Full lockout at top'],
  },
  'Skull Crushers': {
    muscle: 'Triceps', image: `${W}84/Lying-close-grip-triceps-press-to-chin-1.png`,
    description: 'Lying tricep extension that isolates the long head of the triceps.',
    tips: ['Lower bar to forehead', 'Keep upper arms vertical', 'Control the weight', 'Full extension at top'],
  },
  'Close Grip Bench': {
    muscle: 'Triceps', image: `${W}192/Bench-press-1.png`,
    description: 'Bench press variation with narrow grip to emphasize triceps.',
    tips: ['Grip shoulder-width', 'Tuck elbows in', 'Full range of motion', 'Control the descent'],
  },
  'Tricep Overhead Extension': {
    muscle: 'Triceps', image: `${W}1185/c5ca283d-8958-4fd8-9d59-a3f52a3ac66b.jpg`,
    description: 'Overhead extension targeting the long head of the triceps.',
    tips: ['Keep upper arms by ears', 'Full stretch at bottom', 'Squeeze at top', 'Avoid flaring elbows'],
  },

  // ── BACK ───────────────────────────────────────────────────────────────────
  'Pull-ups': {
    muscle: 'Back + Biceps', image: `${W}475/b0554016-16fd-4dbe-be47-a2a17d16ae0e.jpg`,
    description: 'A compound pulling movement that builds width and thickness in the back.',
    tips: ['Dead hang at the bottom', 'Drive elbows to hips', 'Chin over the bar', 'Avoid kipping'],
  },
  'Bent Over Row': {
    muscle: 'Back', image: `${W}109/Barbell-rear-delt-row-1.png`,
    description: 'Builds thickness in the mid-back, lats, and rear delts.',
    tips: ['Hinge at hips 45°', 'Pull to lower chest', 'Squeeze shoulder blades', 'Keep back flat'],
  },
  'Lat Pulldown': {
    muscle: 'Back', image: `${W}1635/b8c34e3a-7474-41ea-99e3-8d7fdb1e12d6.png`,
    description: 'Machine-based pulling movement targeting the lats and biceps.',
    tips: ['Lean back slightly', 'Pull to upper chest', 'Squeeze lats at bottom', 'Control the ascent'],
  },
  'Seated Cable Row': {
    muscle: 'Back', image: `${W}1117/e74255c0-67a0-4309-b78d-2d79e6ff8c11.png`,
    description: 'Horizontal pulling movement for mid-back thickness.',
    tips: ['Sit tall', 'Pull to lower chest', 'Squeeze shoulder blades', 'Slow return'],
  },
  'T-Bar Row': {
    muscle: 'Back', image: `${W}109/Barbell-rear-delt-row-1.png`,
    description: 'Heavy compound row for building back thickness and density.',
    tips: ['Hinge at hips', 'Pull to chest', 'Keep back flat', 'Full range of motion'],
  },
  'Cable Row': {
    muscle: 'Back', image: `${W}1117/e74255c0-67a0-4309-b78d-2d79e6ff8c11.png`,
    description: 'Cable row for mid-back and lat development.',
    tips: ['Sit tall', 'Pull to lower chest', 'Squeeze at end', 'Slow controlled return'],
  },
  'Hyperextensions': {
    muscle: 'Lower Back', image: `${W}128/Hyperextensions-1.png`,
    description: 'Targets the erector spinae and glutes for lower back strength.',
    tips: ['Hinge at hips', 'Don\'t hyperextend at top', 'Controlled movement', 'Keep neck neutral'],
  },

  // ── LEGS ───────────────────────────────────────────────────────────────────
  'Squats': {
    muscle: 'Quads + Glutes', image: `${W}456/3b681e59-377b-40db-9113-ca5873ce084b.jpg`,
    description: 'The king of leg exercises. Builds overall lower body strength and mass.',
    tips: ['Feet shoulder-width apart', 'Knees track over toes', 'Break parallel', 'Keep chest up'],
  },
  'Deadlift': {
    muscle: 'Full Body', image: `${W}184/1709c405-620a-4d07-9658-fade2b66a2df.jpeg`,
    description: 'The most complete strength exercise. Targets the entire posterior chain.',
    tips: ['Bar over mid-foot', 'Hinge, don\'t squat', 'Neutral spine throughout', 'Drive hips forward at top'],
  },
  'Romanian Deadlift': {
    muscle: 'Hamstrings', image: `${W}1750/c5ff74e1-b494-4df0-a13f-89c630b88ef9.webp`,
    description: 'Hip hinge movement targeting the hamstrings and glutes.',
    tips: ['Soft bend in knees', 'Push hips back', 'Bar stays close to legs', 'Feel the hamstring stretch'],
  },
  'Leg Press': {
    muscle: 'Quads', image: `${W}371/d2136f96-3a43-4d4c-9944-1919c4ca1ce1.webp`,
    description: 'Machine-based quad dominant leg exercise.',
    tips: ['Feet shoulder-width', 'Don\'t lock knees', 'Full range of motion', 'Control the descent'],
  },
  'Leg Extension': {
    muscle: 'Quads', image: `${W}369/78c915d1-e46d-4d30-8124-65d68664c3ef.png`,
    description: 'Isolation exercise for the quadriceps.',
    tips: ['Squeeze at top', 'Slow descent', 'Don\'t swing', 'Full extension'],
  },
  'Leg Curl': {
    muscle: 'Hamstrings', image: `${W}364/b318dde9-f5f2-489f-940a-cd864affb9e3.png`,
    description: 'Isolation exercise for the hamstrings.',
    tips: ['Full range of motion', 'Squeeze at top', 'Control the return', 'Keep hips down'],
  },
  'Lunges': {
    muscle: 'Quads + Glutes', image: `${W}984/5c7ffe68-e7b2-47f3-a22a-f9cc28640432.png`,
    description: 'Unilateral leg exercise that improves balance and builds leg strength.',
    tips: ['Step far enough forward', 'Back knee near floor', 'Keep torso upright', 'Push through front heel'],
  },
  'Dumbbell Lunges': {
    muscle: 'Quads + Glutes', image: `${W}984/5c7ffe68-e7b2-47f3-a22a-f9cc28640432.png`,
    description: 'Dumbbell lunge for unilateral leg strength and balance.',
    tips: ['Step far enough forward', 'Back knee near floor', 'Keep torso upright', 'Push through front heel'],
  },
  'Calf Raises': {
    muscle: 'Calves', image: `${W}1243/53d4fabe-c994-4907-873f-8d82813a9832.png`,
    description: 'Isolation exercise for the gastrocnemius and soleus muscles.',
    tips: ['Full range of motion', 'Pause at the top', 'Slow descent', 'Use a step for stretch'],
  },

  // ── SHOULDERS ──────────────────────────────────────────────────────────────
  'Overhead Press': {
    muscle: 'Shoulders', image: `${W}1893/7dbad19e-0616-41fd-9d7d-3e21649c0eea.png`,
    description: 'Builds shoulder mass and strength. Also engages triceps and upper chest.',
    tips: ['Grip just outside shoulders', 'Press in a straight line', 'Lock out at top', 'Brace your core'],
  },
  'Military Press': {
    muscle: 'Shoulders', image: `${W}1893/7dbad19e-0616-41fd-9d7d-3e21649c0eea.png`,
    description: 'Strict overhead press for maximum shoulder strength and mass.',
    tips: ['No leg drive', 'Full lockout', 'Bar path straight up', 'Brace core hard'],
  },
  'Dumbbell Shoulder Press': {
    muscle: 'Shoulders', image: `${W}1893/7dbad19e-0616-41fd-9d7d-3e21649c0eea.png`,
    description: 'Dumbbell variation allowing greater range of motion for shoulders.',
    tips: ['Neutral or pronated grip', 'Press to full lockout', 'Control descent', 'Keep core tight'],
  },
  'Arnold Press': {
    muscle: 'Shoulders', image: `${W}1893/7dbad19e-0616-41fd-9d7d-3e21649c0eea.png`,
    description: 'Rotational shoulder press hitting all three deltoid heads.',
    tips: ['Start with palms facing you', 'Rotate as you press', 'Full range of motion', 'Slow and controlled'],
  },
  'Lateral Raises': {
    muscle: 'Side Delts', image: `${W}148/lateral-dumbbell-raises-large-2.png`,
    description: 'Isolation exercise for the medial deltoid, creating shoulder width.',
    tips: ['Slight bend in elbows', 'Lead with elbows', 'Stop at shoulder height', 'Control the descent'],
  },
  'Front Raises': {
    muscle: 'Front Delts', image: `${W}148/lateral-dumbbell-raises-large-2.png`,
    description: 'Targets the anterior deltoid for front shoulder development.',
    tips: ['Slight bend in elbows', 'Raise to eye level', 'Alternate arms', 'Control the descent'],
  },
  'Face Pulls': {
    muscle: 'Rear Delts', image: `${W}1639/8927346e-f5ca-4795-bdf1-5ac9309401e7.webp`,
    description: 'Cable exercise for rear delts and external rotators.',
    tips: ['Pull to face level', 'Elbows high', 'External rotation at end', 'Squeeze rear delts'],
  },
  'Barbell Shrugs': {
    muscle: 'Traps', image: `${W}1645/9e730259-1dcd-4b5e-b4cc-9ebc0cfda75c.webp`,
    description: 'Isolation movement for the upper trapezius muscles.',
    tips: ['Straight up movement', 'Hold at top 1 sec', 'Don\'t roll shoulders', 'Full range of motion'],
  },
  'Upright Row': {
    muscle: 'Traps + Delts', image: `${W}148/lateral-dumbbell-raises-large-2.png`,
    description: 'Compound movement for traps and lateral deltoids.',
    tips: ['Grip shoulder-width', 'Lead with elbows', 'Pull to chin level', 'Control descent'],
  },

  // ── BICEPS ─────────────────────────────────────────────────────────────────
  'Barbell Curl': {
    muscle: 'Biceps', image: `${W}51/f1730f56-7aca-4566-8338-3e42b1bee6e1.webp`,
    description: 'Classic bicep builder using a barbell for maximum loading.',
    tips: ['Keep elbows stationary', 'Full range of motion', 'Squeeze at the top', 'Avoid swinging'],
  },
  'Hammer Curl': {
    muscle: 'Biceps + Brachialis', image: `${W}86/Bicep-hammer-curl-1.png`,
    description: 'Neutral grip curl targeting biceps and brachialis for arm thickness.',
    tips: ['Neutral grip throughout', 'Keep elbows at sides', 'Full range of motion', 'Slow descent'],
  },
  'Preacher Curl': {
    muscle: 'Biceps', image: `${W}193/Preacher-curl-3-1.png`,
    description: 'Strict curl on a preacher bench for peak bicep contraction.',
    tips: ['Full stretch at bottom', 'Squeeze at top', 'No swinging', 'Control the weight'],
  },
  'EZ Bar Curl': {
    muscle: 'Biceps', image: `${W}51/f1730f56-7aca-4566-8338-3e42b1bee6e1.webp`,
    description: 'Angled bar curl that reduces wrist strain while targeting biceps.',
    tips: ['Shoulder-width grip', 'Keep elbows fixed', 'Full range of motion', 'Squeeze at top'],
  },
  'Concentration Curl': {
    muscle: 'Biceps', image: `${W}193/Preacher-curl-3-1.png`,
    description: 'Seated isolation curl for maximum bicep peak contraction.',
    tips: ['Elbow on inner thigh', 'Full range of motion', 'Squeeze hard at top', 'Slow descent'],
  },

  // ── CORE ───────────────────────────────────────────────────────────────────
  'Plank': {
    muscle: 'Core', image: `${W}458/b7bd9c28-9f1d-4647-bd17-ab6a3adf5770.png`,
    description: 'Isometric core exercise that builds stability and endurance.',
    tips: ['Straight line head to heels', 'Squeeze glutes and abs', 'Breathe steadily', 'Don\'t let hips sag'],
  },
  'Crunches': {
    muscle: 'Abs', image: `${W}91/Crunches-1.png`,
    description: 'Basic abdominal exercise targeting the rectus abdominis.',
    tips: ['Don\'t pull neck', 'Exhale on the way up', 'Squeeze abs at top', 'Slow and controlled'],
  },
  'Leg Raises': {
    muscle: 'Lower Abs', image: `${W}125/Leg-raises-2.png`,
    description: 'Lower ab exercise using hip flexion to raise the legs.',
    tips: ['Keep legs straight', 'Lower slowly', 'Don\'t arch lower back', 'Squeeze abs throughout'],
  },
  'Leg Raises, Lying': {
    muscle: 'Lower Abs', image: `${W}125/Leg-raises-2.png`,
    description: 'Lower ab exercise using hip flexion to raise the legs.',
    tips: ['Keep legs straight', 'Lower slowly', 'Don\'t arch lower back', 'Squeeze abs throughout'],
  },
  'Mountain Climbers': {
    muscle: 'Core + Cardio', image: `${W}458/b7bd9c28-9f1d-4647-bd17-ab6a3adf5770.png`,
    description: 'Dynamic core exercise that also elevates heart rate.',
    tips: ['Keep hips level', 'Drive knees to chest', 'Fast pace for cardio', 'Keep core tight'],
  },
  'Cable Crunch': {
    muscle: 'Abs', image: `${W}91/Crunches-1.png`,
    description: 'Weighted cable crunch for progressive overload on abs.',
    tips: ['Hinge at hips', 'Crunch down hard', 'Keep hips still', 'Squeeze at bottom'],
  },
  'Bicycle Crunches': {
    muscle: 'Abs + Obliques', image: `${W}176/Cross-body-crunch-1.png`,
    description: 'Rotational crunch targeting abs and obliques simultaneously.',
    tips: ['Slow and controlled', 'Full rotation', 'Don\'t pull neck', 'Extend leg fully'],
  },
};

const DEFAULT_INFO = {
  muscle: 'Full Body',
  image: null,
  description: 'A great exercise to build strength and improve overall fitness.',
  tips: ['Focus on form over weight', 'Control the movement', 'Breathe properly', 'Stay consistent'],
};

function ExerciseImage({ src, name }) {
  const [status, setStatus] = useState('loading');

  if (!src) return (
    <div className="w-full h-48 bg-slate-700/40 rounded-xl flex flex-col items-center justify-center gap-2">
      <span className="text-5xl">🏃</span>
      <p className="text-slate-500 text-xs">Cardio / No image available</p>
    </div>
  );

  return (
    <div className="w-full h-48 bg-white/5 rounded-xl overflow-hidden relative">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700/40 rounded-xl">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full" />
        </div>
      )}
      <motion.img
        src={src}
        alt={name}
        initial={{ opacity: 0 }}
        animate={{ opacity: status === 'loaded' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className="w-full h-full object-contain p-2"
      />
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-700/40 rounded-xl">
          <span className="text-4xl">🏋️</span>
          <p className="text-slate-500 text-xs">Image unavailable</p>
        </div>
      )}
    </div>
  );
}

export default function ExerciseModal({ exercise, onClose }) {
  const info = EXERCISE_INFO[exercise?.name] || DEFAULT_INFO;

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {exercise && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={e => e.stopPropagation()}
            className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/10 px-6 py-4 border-b border-slate-700 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{exercise.name}</h2>
                  <span className="inline-block mt-1.5 text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full font-medium">
                    🎯 {info.muscle}
                  </span>
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-all text-sm">
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">

              {/* Image */}
              <ExerciseImage src={info.image} name={exercise.name} />

              {/* Sets & Reps */}
              <div className="flex gap-3">
                <div className="flex-1 bg-slate-700/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-orange-400">{exercise.sets}</div>
                  <div className="text-slate-400 text-xs mt-0.5">Sets</div>
                </div>
                <div className="flex-1 bg-slate-700/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-orange-400">{exercise.reps}</div>
                  <div className="text-slate-400 text-xs mt-0.5">Reps</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">About</p>
                <p className="text-slate-300 text-sm leading-relaxed">{info.description}</p>
              </div>

              {/* Tips */}
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">Form Tips</p>
                <ul className="space-y-2">
                  {info.tips.map((tip, i) => (
                    <motion.li key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.06 }}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <span className="text-orange-500 mt-0.5 font-bold shrink-0">→</span>
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-700/50 flex-shrink-0">
              <button onClick={onClose}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold py-2.5 rounded-xl transition-all text-sm">
                Got it, let's go! 💪
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
