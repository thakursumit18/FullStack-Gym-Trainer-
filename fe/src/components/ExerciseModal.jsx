import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const G = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const W = 'https://wger.de/media/exercise-images/';

const EXERCISE_INFO = {
  // ── CHEST ──────────────────────────────────────────────────
  'Bench Press':            { muscle: 'Chest',          gif: `${G}Barbell_Bench_Press_-_Medium_Grip/0.jpg`,                    description: 'A compound push movement targeting the pectorals, anterior deltoids, and triceps.',         tips: ['Keep shoulder blades retracted', 'Drive feet into the floor', 'Lower bar to mid-chest', 'Full range of motion'] },
  'Incline Dumbbell Press': { muscle: 'Upper Chest',    gif: `${G}Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg`,           description: 'Targets the upper portion of the pectorals with a 30–45° incline angle.',                  tips: ['Set bench to 30–45°', 'Control the descent', 'Squeeze at the top', 'Keep core tight'] },
  'Incline Barbell Press':  { muscle: 'Upper Chest',    gif: `${G}Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg`,           description: 'Barbell variation of the incline press for maximum upper chest overload.',                  tips: ['Set bench to 30°', 'Grip slightly wider than shoulder', 'Control the descent', 'Full lockout at top'] },
  'Dumbbell Press':         { muscle: 'Chest',          gif: `${G}Dumbbell_Bench_Press/0.jpg`,                                description: 'Flat dumbbell press for chest with greater range of motion than barbell.',                  tips: ['Touch dumbbells at top', 'Full stretch at bottom', 'Control the weight', 'Neutral or pronated grip'] },
  'Cable Flyes':            { muscle: 'Chest',          gif: `${G}Flat_Bench_Cable_Flyes/0.jpg`,                              description: 'Cable isolation movement for chest with constant tension throughout.',                     tips: ['Slight bend in elbows', 'Squeeze at center', 'Full stretch at sides', 'Control the movement'] },
  'Push-ups':               { muscle: 'Chest + Triceps',gif: `${G}Pushups/0.jpg`,                                             description: 'Fundamental bodyweight push exercise for chest and triceps.',                              tips: ['Straight body line', 'Chest to floor', 'Full lockout at top', 'Elbows at 45°'] },
  'Dips':                   { muscle: 'Chest + Triceps',gif: `${G}Dips_-_Triceps_Version/0.jpg`,                              description: 'Bodyweight dip for lower chest and triceps development.',                                  tips: ['Lean forward for chest', 'Lower to 90°', 'Full lockout at top', 'Control the descent'] },

  // ── TRICEPS ────────────────────────────────────────────────
  'Tricep Pushdown':          { muscle: 'Triceps', gif: `${G}Cable_One_Arm_Tricep_Extension/0.jpg`,                           description: 'Isolation exercise for the triceps using a cable machine.',                                 tips: ['Keep elbows pinned to sides', 'Full extension at bottom', 'Slow on the way up', 'Avoid swinging'] },
  'Tricep Dips':              { muscle: 'Triceps', gif: `${G}Dips_-_Triceps_Version/0.jpg`,                                  description: 'Bodyweight compound movement for triceps and lower chest.',                                tips: ['Keep torso upright for triceps', 'Lower until elbows at 90°', 'Keep elbows close', 'Full lockout at top'] },
  'Skull Crushers':           { muscle: 'Triceps', gif: `${G}Lying_Close-Grip_Barbell_Triceps_Press_To_Chin/0.jpg`,          description: 'Lying tricep extension that isolates the long head of the triceps.',                       tips: ['Lower bar to forehead', 'Keep upper arms vertical', 'Control the weight', 'Full extension at top'] },
  'Close Grip Bench':         { muscle: 'Triceps', gif: `${G}Close-Grip_Barbell_Bench_Press/0.jpg`,                          description: 'Bench press variation with narrow grip to emphasize triceps.',                             tips: ['Grip shoulder-width', 'Tuck elbows in', 'Full range of motion', 'Control the descent'] },
  'Tricep Overhead Extension':{ muscle: 'Triceps', gif: `${G}Cable_Rope_Overhead_Triceps_Extension/0.jpg`,                   description: 'Overhead extension targeting the long head of the triceps.',                               tips: ['Keep upper arms by ears', 'Full stretch at bottom', 'Squeeze at top', 'Avoid flaring elbows'] },

  // ── BACK ───────────────────────────────────────────────────
  'Pull-ups':        { muscle: 'Back + Biceps', gif: `${G}Pullups/0.jpg`,                          description: 'A compound pulling movement that builds width and thickness in the back.',  tips: ['Dead hang at the bottom', 'Drive elbows to hips', 'Chin over the bar', 'Avoid kipping'] },
  'Bent Over Row':   { muscle: 'Back',          gif: `${G}Bent_Over_Barbell_Row/0.jpg`,            description: 'Builds thickness in the mid-back, lats, and rear delts.',                   tips: ['Hinge at hips 45°', 'Pull to lower chest', 'Squeeze shoulder blades', 'Keep back flat'] },
  'Lat Pulldown':    { muscle: 'Back',          gif: `${G}Close-Grip_Front_Lat_Pulldown/0.jpg`,    description: 'Machine-based pulling movement targeting the lats and biceps.',              tips: ['Lean back slightly', 'Pull to upper chest', 'Squeeze lats at bottom', 'Control the ascent'] },
  'Seated Cable Row':{ muscle: 'Back',          gif: `${G}Elevated_Cable_Rows/0.jpg`,              description: 'Horizontal pulling movement for mid-back thickness.',                        tips: ['Sit tall', 'Pull to lower chest', 'Squeeze shoulder blades', 'Slow return'] },
  'T-Bar Row':       { muscle: 'Back',          gif: `${G}Lying_T-Bar_Row/0.jpg`,                  description: 'Heavy compound row for building back thickness and density.',                tips: ['Hinge at hips', 'Pull to chest', 'Keep back flat', 'Full range of motion'] },
  'Cable Row':       { muscle: 'Back',          gif: `${G}Elevated_Cable_Rows/0.jpg`,              description: 'Cable row for mid-back and lat development.',                                tips: ['Sit tall', 'Pull to lower chest', 'Squeeze at end', 'Slow controlled return'] },
  'Hyperextensions': { muscle: 'Lower Back',    gif: `${W}128/Hyperextensions-1.png`,              description: 'Targets the erector spinae and glutes for lower back strength.',             tips: ['Hinge at hips', "Don't hyperextend at top", 'Controlled movement', 'Keep neck neutral'] },
  'Deadlift':        { muscle: 'Full Body',     gif: `${G}Barbell_Deadlift/0.jpg`,                 description: 'The most complete strength exercise. Targets the entire posterior chain.',   tips: ['Bar over mid-foot', "Hinge, don't squat", 'Neutral spine throughout', 'Drive hips forward at top'] },

  // ── LEGS ───────────────────────────────────────────────────
  'Squats':            { muscle: 'Quads + Glutes', gif: `${G}Barbell_Squat/0.jpg`,              description: 'The king of leg exercises. Builds overall lower body strength and mass.',  tips: ['Feet shoulder-width apart', 'Knees track over toes', 'Break parallel', 'Keep chest up'] },
  'Romanian Deadlift': { muscle: 'Hamstrings',     gif: `${G}Romanian_Deadlift/0.jpg`,          description: 'Hip hinge movement targeting the hamstrings and glutes.',                   tips: ['Soft bend in knees', 'Push hips back', 'Bar stays close to legs', 'Feel the hamstring stretch'] },
  'Leg Press':         { muscle: 'Quads',           gif: `${G}Leg_Press/0.jpg`,                  description: 'Machine-based quad dominant leg exercise.',                                 tips: ["Feet shoulder-width", "Don't lock knees", 'Full range of motion', 'Control the descent'] },
  'Leg Extension':     { muscle: 'Quads',           gif: `${G}Leg_Extensions/0.jpg`,             description: 'Isolation exercise for the quadriceps.',                                    tips: ['Squeeze at top', 'Slow descent', "Don't swing", 'Full extension'] },
  'Leg Curl':          { muscle: 'Hamstrings',      gif: `${G}Lying_Leg_Curls/0.jpg`,            description: 'Isolation exercise for the hamstrings.',                                    tips: ['Full range of motion', 'Squeeze at top', 'Control the return', 'Keep hips down'] },
  'Lunges':            { muscle: 'Quads + Glutes',  gif: `${G}Barbell_Lunge/0.jpg`,              description: 'Unilateral leg exercise that improves balance and builds leg strength.',    tips: ['Step far enough forward', 'Back knee near floor', 'Keep torso upright', 'Push through front heel'] },
  'Dumbbell Lunges':   { muscle: 'Quads + Glutes',  gif: `${G}Barbell_Lunge/0.jpg`,              description: 'Dumbbell lunge for unilateral leg strength and balance.',                   tips: ['Step far enough forward', 'Back knee near floor', 'Keep torso upright', 'Push through front heel'] },
  'Calf Raises':       { muscle: 'Calves',           gif: `${G}Calf_Press/0.jpg`,                 description: 'Isolation exercise for the gastrocnemius and soleus muscles.',              tips: ['Full range of motion', 'Pause at the top', 'Slow descent', 'Use a step for stretch'] },

  // ── SHOULDERS ──────────────────────────────────────────────
  'Overhead Press':          { muscle: 'Shoulders',    gif: `${G}Barbell_Shoulder_Press/0.jpg`,           description: 'Builds shoulder mass and strength. Also engages triceps and upper chest.',  tips: ['Grip just outside shoulders', 'Press in a straight line', 'Lock out at top', 'Brace your core'] },
  'Military Press':          { muscle: 'Shoulders',    gif: `${G}Barbell_Shoulder_Press/0.jpg`,           description: 'Strict overhead press for maximum shoulder strength and mass.',              tips: ['No leg drive', 'Full lockout', 'Bar path straight up', 'Brace core hard'] },
  'Dumbbell Shoulder Press': { muscle: 'Shoulders',    gif: `${G}Dumbbell_Shoulder_Press/0.jpg`,          description: 'Dumbbell variation allowing greater range of motion for shoulders.',          tips: ['Neutral or pronated grip', 'Press to full lockout', 'Control descent', 'Keep core tight'] },
  'Arnold Press':            { muscle: 'Shoulders',    gif: `${G}Arnold_Dumbbell_Press/0.jpg`,            description: 'Rotational shoulder press hitting all three deltoid heads.',                  tips: ['Start with palms facing you', 'Rotate as you press', 'Full range of motion', 'Slow and controlled'] },
  'Lateral Raises':          { muscle: 'Side Delts',   gif: `${G}Lateral_Raise_-_With_Bands/0.jpg`,       description: 'Isolation exercise for the medial deltoid, creating shoulder width.',          tips: ['Slight bend in elbows', 'Lead with elbows', 'Stop at shoulder height', 'Control the descent'] },
  'Front Raises':            { muscle: 'Front Delts',  gif: `${G}Front_Plate_Raise/0.jpg`,                description: 'Targets the anterior deltoid for front shoulder development.',                 tips: ['Slight bend in elbows', 'Raise to eye level', 'Alternate arms', 'Control the descent'] },
  'Face Pulls':              { muscle: 'Rear Delts',   gif: `${G}Cable_Rope_Rear-Delt_Rows/0.jpg`,        description: 'Cable exercise for rear delts and external rotators.',                        tips: ['Pull to face level', 'Elbows high', 'External rotation at end', 'Squeeze rear delts'] },
  'Barbell Shrugs':          { muscle: 'Traps',        gif: `${G}Barbell_Shrug/0.jpg`,                    description: 'Isolation movement for the upper trapezius muscles.',                        tips: ['Straight up movement', 'Hold at top 1 sec', "Don't roll shoulders", 'Full range of motion'] },
  'Upright Row':             { muscle: 'Traps + Delts',gif: `${G}Dumbbell_One-Arm_Upright_Row/0.jpg`,     description: 'Compound movement for traps and lateral deltoids.',                           tips: ['Grip shoulder-width', 'Lead with elbows', 'Pull to chin level', 'Control descent'] },

  // ── BICEPS ─────────────────────────────────────────────────
  'Barbell Curl':       { muscle: 'Biceps',              gif: `${G}Barbell_Curl/0.jpg`,                          description: 'Classic bicep builder using a barbell for maximum loading.',                  tips: ['Keep elbows stationary', 'Full range of motion', 'Squeeze at the top', 'Avoid swinging'] },
  'Hammer Curl':        { muscle: 'Biceps + Brachialis', gif: `${G}Hammer_Curls/0.jpg`,                          description: 'Neutral grip curl targeting biceps and brachialis for arm thickness.',         tips: ['Neutral grip throughout', 'Keep elbows at sides', 'Full range of motion', 'Slow descent'] },
  'Preacher Curl':      { muscle: 'Biceps',              gif: `${G}Barbell_Curls_Lying_Against_An_Incline/0.jpg`, description: 'Strict curl on a preacher bench for peak bicep contraction.',                 tips: ['Full stretch at bottom', 'Squeeze at top', 'No swinging', 'Control the weight'] },
  'EZ Bar Curl':        { muscle: 'Biceps',              gif: `${G}Close-Grip_EZ_Bar_Curl/0.jpg`,                description: 'Angled bar curl that reduces wrist strain while targeting biceps.',             tips: ['Shoulder-width grip', 'Keep elbows fixed', 'Full range of motion', 'Squeeze at top'] },
  'Concentration Curl': { muscle: 'Biceps',              gif: `${G}Concentration_Curls/0.jpg`,                   description: 'Seated isolation curl for maximum bicep peak contraction.',                   tips: ['Elbow on inner thigh', 'Full range of motion', 'Squeeze hard at top', 'Slow descent'] },

  // ── CORE ───────────────────────────────────────────────────
  'Plank':             { muscle: 'Core',           gif: `${G}Plank/0.jpg`,                    description: 'Isometric core exercise that builds stability and endurance.',                tips: ['Straight line head to heels', 'Squeeze glutes and abs', 'Breathe steadily', "Don't let hips sag"] },
  'Crunches':          { muscle: 'Abs',            gif: `${G}Crunches/0.jpg`,                 description: 'Basic abdominal exercise targeting the rectus abdominis.',                   tips: ["Don't pull neck", 'Exhale on the way up', 'Squeeze abs at top', 'Slow and controlled'] },
  'Leg Raises':        { muscle: 'Lower Abs',      gif: `${G}Hanging_Leg_Raise/0.jpg`,        description: 'Lower ab exercise using hip flexion to raise the legs.',                     tips: ['Keep legs straight', 'Lower slowly', "Don't arch lower back", 'Squeeze abs throughout'] },
  'Mountain Climbers': { muscle: 'Core + Cardio',  gif: `${G}Mountain_Climbers/0.jpg`,        description: 'Dynamic core exercise that also elevates heart rate.',                       tips: ['Keep hips level', 'Drive knees to chest', 'Fast pace for cardio', 'Keep core tight'] },
  'Cable Crunch':      { muscle: 'Abs',            gif: `${G}Kneeling_Cable_Triceps_Extension/0.jpg`, description: 'Weighted cable crunch for progressive overload on abs.',              tips: ['Hinge at hips', 'Crunch down hard', 'Keep hips still', 'Squeeze at bottom'] },
  'Bicycle Crunches':  { muscle: 'Abs + Obliques', gif: `${G}Cross_Body_Hammer_Curl/0.jpg`,   description: 'Rotational crunch targeting abs and obliques simultaneously.',               tips: ['Slow and controlled', 'Full rotation', "Don't pull neck", 'Extend leg fully'] },
  'Hanging Knee Raises':{ muscle: 'Lower Abs',     gif: `${G}Hanging_Leg_Raise/0.jpg`,        description: 'Hanging knee raise for lower ab and hip flexor strength.',                   tips: ['Control the swing', 'Bring knees to chest', 'Slow descent', 'Keep core tight'] },

  // ── CARDIO ─────────────────────────────────────────────────
  'Jumping Jacks':  { muscle: 'Cardio',          gif: `${W}458/b7bd9c28-9f1d-4647-bd17-ab6a3adf5770.png`, description: 'Classic warm-up and cardio exercise for full body activation.',    tips: ['Land softly', 'Arms fully extended', 'Consistent pace', 'Stay light on feet'] },
  'Burpees':        { muscle: 'Full Body Cardio', gif: `${W}458/b7bd9c28-9f1d-4647-bd17-ab6a3adf5770.png`, description: 'Full body explosive movement combining squat, plank and jump.',   tips: ['Explosive jump at top', 'Chest to floor', 'Fast transitions', 'Breathe rhythmically'] },
  'High Knees':     { muscle: 'Cardio + Core',   gif: `${G}Mountain_Climbers/0.jpg`,                       description: 'Running in place with high knee drive for cardio and core.',      tips: ['Drive knees to hip height', 'Pump arms', 'Stay on balls of feet', 'Fast pace'] },
  'Box Jumps':      { muscle: 'Legs + Power',    gif: `${G}Barbell_Squat/0.jpg`,                           description: 'Plyometric jump onto a box for explosive leg power.',              tips: ['Soft landing', 'Full hip extension at top', 'Step down safely', 'Land with bent knees'] },
  'Jump Rope':      { muscle: 'Cardio',          gif: `${W}458/b7bd9c28-9f1d-4647-bd17-ab6a3adf5770.png`, description: 'High-intensity cardio that improves coordination and burns calories.', tips: ['Stay on balls of feet', 'Keep elbows close', 'Consistent rhythm', 'Land softly'] },
  'Treadmill Run':  { muscle: 'Cardio',          gif: null,                                                 description: '20 minutes of steady-state cardio to burn fat and improve endurance.', tips: ['Warm up at slow pace', 'Maintain steady breathing', 'Land mid-foot', 'Stay hydrated'] },
};

const DEFAULT_INFO = {
  muscle: 'Full Body',
  gif: null,
  description: 'A great exercise to build strength and improve overall fitness.',
  tips: ['Focus on form over weight', 'Control the movement', 'Breathe properly', 'Stay consistent'],
};

function ExerciseGif({ src, name }) {
  const [status, setStatus] = useState('loading');

  if (!src) return (
    <div className="w-full h-52 bg-slate-700/40 rounded-xl flex flex-col items-center justify-center gap-2">
      <span className="text-5xl">🏃</span>
      <p className="text-slate-500 text-xs">Cardio — no demo available</p>
    </div>
  );

  return (
    <div className="w-full h-52 bg-slate-700/20 rounded-xl overflow-hidden relative">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700/40">
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
        className="w-full h-full object-cover"
      />
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-700/40">
          <span className="text-4xl">🏋️</span>
          <p className="text-slate-500 text-xs">Demo unavailable</p>
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

              {/* GIF / Image */}
              <ExerciseGif src={info.gif} name={exercise.name} />

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
                      className="flex items-start gap-2 text-sm text-slate-300">
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
