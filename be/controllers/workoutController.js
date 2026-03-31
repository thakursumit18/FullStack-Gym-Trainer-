const WORKOUT_PLANS = {
  lose_fat: [
    { day: 'Monday', focus: 'Chest + Triceps', exercises: [{ name: 'Push-ups', sets: 4, reps: 15 }, { name: 'Bench Press', sets: 3, reps: 12 }, { name: 'Incline Dumbbell Press', sets: 3, reps: 12 }, { name: 'Tricep Dips', sets: 3, reps: 15 }, { name: 'Tricep Pushdown', sets: 3, reps: 15 }] },
    { day: 'Tuesday', focus: 'Back + Biceps', exercises: [{ name: 'Pull-ups', sets: 4, reps: 10 }, { name: 'Bent Over Row', sets: 3, reps: 12 }, { name: 'Lat Pulldown', sets: 3, reps: 12 }, { name: 'Barbell Curl', sets: 3, reps: 12 }, { name: 'Hammer Curl', sets: 3, reps: 12 }] },
    { day: 'Wednesday', focus: 'Cardio + Core', exercises: [{ name: 'Treadmill Run', sets: 1, reps: '20 min' }, { name: 'Plank', sets: 3, reps: '45 sec' }, { name: 'Crunches', sets: 3, reps: 20 }, { name: 'Leg Raises', sets: 3, reps: 15 }, { name: 'Mountain Climbers', sets: 3, reps: 20 }] },
    { day: 'Thursday', focus: 'Shoulders', exercises: [{ name: 'Overhead Press', sets: 4, reps: 10 }, { name: 'Lateral Raises', sets: 3, reps: 15 }, { name: 'Front Raises', sets: 3, reps: 12 }, { name: 'Face Pulls', sets: 3, reps: 15 }, { name: 'Arnold Press', sets: 3, reps: 10 }] },
    { day: 'Friday', focus: 'Legs', exercises: [{ name: 'Squats', sets: 4, reps: 12 }, { name: 'Lunges', sets: 3, reps: 12 }, { name: 'Leg Press', sets: 3, reps: 15 }, { name: 'Leg Curl', sets: 3, reps: 12 }, { name: 'Calf Raises', sets: 4, reps: 20 }] },
    { day: 'Saturday', focus: 'HIIT Cardio', exercises: [{ name: 'Jumping Jacks', sets: 3, reps: 30 }, { name: 'Burpees', sets: 3, reps: 15 }, { name: 'High Knees', sets: 3, reps: 30 }, { name: 'Box Jumps', sets: 3, reps: 12 }, { name: 'Jump Rope', sets: 3, reps: '1 min' }] },
    { day: 'Sunday', focus: 'Rest Day', exercises: [{ name: 'Light Stretching', sets: 1, reps: '15 min' }, { name: 'Yoga / Walk', sets: 1, reps: '20 min' }] },
  ],
  gain_muscle: [
    { day: 'Monday', focus: 'Chest + Triceps', exercises: [{ name: 'Bench Press', sets: 4, reps: 8 }, { name: 'Incline Barbell Press', sets: 4, reps: 8 }, { name: 'Cable Flyes', sets: 3, reps: 12 }, { name: 'Close Grip Bench', sets: 3, reps: 10 }, { name: 'Skull Crushers', sets: 3, reps: 10 }] },
    { day: 'Tuesday', focus: 'Back + Biceps', exercises: [{ name: 'Deadlift', sets: 4, reps: 6 }, { name: 'Pull-ups', sets: 4, reps: 8 }, { name: 'Seated Cable Row', sets: 3, reps: 10 }, { name: 'Barbell Curl', sets: 4, reps: 10 }, { name: 'Preacher Curl', sets: 3, reps: 10 }] },
    { day: 'Wednesday', focus: 'Legs', exercises: [{ name: 'Squats', sets: 5, reps: 6 }, { name: 'Romanian Deadlift', sets: 4, reps: 8 }, { name: 'Leg Press', sets: 4, reps: 10 }, { name: 'Leg Extension', sets: 3, reps: 12 }, { name: 'Calf Raises', sets: 4, reps: 15 }] },
    { day: 'Thursday', focus: 'Shoulders + Traps', exercises: [{ name: 'Military Press', sets: 4, reps: 8 }, { name: 'Dumbbell Shoulder Press', sets: 3, reps: 10 }, { name: 'Lateral Raises', sets: 4, reps: 12 }, { name: 'Barbell Shrugs', sets: 4, reps: 12 }, { name: 'Upright Row', sets: 3, reps: 10 }] },
    { day: 'Friday', focus: 'Chest + Back (Volume)', exercises: [{ name: 'Dumbbell Press', sets: 4, reps: 10 }, { name: 'Dips', sets: 4, reps: 10 }, { name: 'T-Bar Row', sets: 4, reps: 10 }, { name: 'Lat Pulldown', sets: 4, reps: 10 }, { name: 'Hyperextensions', sets: 3, reps: 15 }] },
    { day: 'Saturday', focus: 'Arms + Core', exercises: [{ name: 'EZ Bar Curl', sets: 4, reps: 10 }, { name: 'Tricep Overhead Extension', sets: 4, reps: 10 }, { name: 'Concentration Curl', sets: 3, reps: 12 }, { name: 'Plank', sets: 3, reps: '1 min' }, { name: 'Cable Crunch', sets: 3, reps: 15 }] },
    { day: 'Sunday', focus: 'Rest Day', exercises: [{ name: 'Light Stretching', sets: 1, reps: '15 min' }, { name: 'Foam Rolling', sets: 1, reps: '15 min' }] },
  ],
  maintain: [
    { day: 'Monday', focus: 'Full Body A', exercises: [{ name: 'Squats', sets: 3, reps: 10 }, { name: 'Bench Press', sets: 3, reps: 10 }, { name: 'Bent Over Row', sets: 3, reps: 10 }, { name: 'Overhead Press', sets: 3, reps: 10 }, { name: 'Plank', sets: 3, reps: '45 sec' }] },
    { day: 'Tuesday', focus: 'Cardio', exercises: [{ name: 'Brisk Walk / Jog', sets: 1, reps: '30 min' }, { name: 'Cycling', sets: 1, reps: '20 min' }] },
    { day: 'Wednesday', focus: 'Full Body B', exercises: [{ name: 'Deadlift', sets: 3, reps: 8 }, { name: 'Pull-ups', sets: 3, reps: 8 }, { name: 'Dumbbell Lunges', sets: 3, reps: 10 }, { name: 'Lateral Raises', sets: 3, reps: 12 }, { name: 'Crunches', sets: 3, reps: 20 }] },
    { day: 'Thursday', focus: 'Active Recovery', exercises: [{ name: 'Yoga', sets: 1, reps: '30 min' }, { name: 'Stretching', sets: 1, reps: '15 min' }] },
    { day: 'Friday', focus: 'Full Body C', exercises: [{ name: 'Leg Press', sets: 3, reps: 12 }, { name: 'Incline Dumbbell Press', sets: 3, reps: 10 }, { name: 'Cable Row', sets: 3, reps: 10 }, { name: 'Arnold Press', sets: 3, reps: 10 }, { name: 'Leg Raises', sets: 3, reps: 15 }] },
    { day: 'Saturday', focus: 'Cardio + Core', exercises: [{ name: 'Jump Rope', sets: 3, reps: '2 min' }, { name: 'Mountain Climbers', sets: 3, reps: 20 }, { name: 'Bicycle Crunches', sets: 3, reps: 20 }] },
    { day: 'Sunday', focus: 'Rest Day', exercises: [{ name: 'Rest / Light Walk', sets: 1, reps: '20 min' }] },
  ],
};

const MUSCLE_PLANS = {
  abs: {
    label: 'Abs',
    icon: '🔥',
    description: 'Core-focused workout to build a strong, defined midsection',
    exercises: [
      { name: 'Crunches', sets: 4, reps: 25 },
      { name: 'Leg Raises', sets: 4, reps: 20 },
      { name: 'Plank', sets: 3, reps: '60 sec' },
      { name: 'Bicycle Crunches', sets: 3, reps: 20 },
      { name: 'Mountain Climbers', sets: 3, reps: 30 },
      { name: 'Cable Crunch', sets: 3, reps: 15 },
      { name: 'Hanging Knee Raises', sets: 3, reps: 15 },
    ],
  },
  legs: {
    label: 'Legs',
    icon: '🦵',
    description: 'Complete lower body workout targeting quads, hamstrings, glutes and calves',
    exercises: [
      { name: 'Squats', sets: 4, reps: 12 },
      { name: 'Romanian Deadlift', sets: 4, reps: 10 },
      { name: 'Leg Press', sets: 4, reps: 12 },
      { name: 'Lunges', sets: 3, reps: 12 },
      { name: 'Leg Curl', sets: 3, reps: 12 },
      { name: 'Leg Extension', sets: 3, reps: 15 },
      { name: 'Calf Raises', sets: 4, reps: 20 },
    ],
  },
  chest: {
    label: 'Chest',
    icon: '💪',
    description: 'Full chest workout targeting upper, middle and lower pectorals',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 10 },
      { name: 'Incline Dumbbell Press', sets: 4, reps: 10 },
      { name: 'Cable Flyes', sets: 3, reps: 12 },
      { name: 'Push-ups', sets: 3, reps: 20 },
      { name: 'Dips', sets: 3, reps: 12 },
      { name: 'Dumbbell Press', sets: 3, reps: 12 },
    ],
  },
  arms: {
    label: 'Full Arms',
    icon: '💪',
    description: 'Complete arms workout — shoulders, biceps and triceps for maximum size',
    exercises: [
      { name: 'Overhead Press', sets: 4, reps: 10 },
      { name: 'Lateral Raises', sets: 3, reps: 15 },
      { name: 'Barbell Curl', sets: 4, reps: 12 },
      { name: 'Hammer Curl', sets: 3, reps: 12 },
      { name: 'Tricep Pushdown', sets: 4, reps: 12 },
      { name: 'Skull Crushers', sets: 3, reps: 10 },
      { name: 'Arnold Press', sets: 3, reps: 10 },
      { name: 'Preacher Curl', sets: 3, reps: 10 },
    ],
  },
  back: {
    label: 'Wider Back',
    icon: '🏋️',
    description: 'Back width and thickness workout for a powerful V-taper',
    exercises: [
      { name: 'Pull-ups', sets: 4, reps: 10 },
      { name: 'Lat Pulldown', sets: 4, reps: 12 },
      { name: 'Bent Over Row', sets: 4, reps: 10 },
      { name: 'Seated Cable Row', sets: 3, reps: 12 },
      { name: 'T-Bar Row', sets: 3, reps: 10 },
      { name: 'Deadlift', sets: 3, reps: 6 },
      { name: 'Hyperextensions', sets: 3, reps: 15 },
    ],
  },
};

const getMuscleWorkout = (req, res) => {
  const { muscle } = req.params;
  if (!MUSCLE_PLANS[muscle]) return res.status(404).json({ message: 'Muscle group not found' });
  res.json(MUSCLE_PLANS[muscle]);
};

const getAllMuscleWorkouts = (req, res) => res.json(MUSCLE_PLANS);

const getWorkoutPlan = (req, res) => {
  const goal = req.user.goal || 'maintain';
  const plan = WORKOUT_PLANS[goal];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const todayWorkout = plan.find(d => d.day === todayName) || plan[0];
  res.json({ plan, todayWorkout });
};

const getAllWorkouts = (req, res) => res.json(WORKOUT_PLANS);

const updateWorkoutDay = (req, res) => {
  const { goal, dayIndex } = req.params;
  if (!WORKOUT_PLANS[goal]) return res.status(404).json({ message: 'Goal not found' });
  WORKOUT_PLANS[goal][dayIndex] = { ...WORKOUT_PLANS[goal][dayIndex], ...req.body };
  res.json(WORKOUT_PLANS[goal][dayIndex]);
};

module.exports = { getWorkoutPlan, getAllWorkouts, updateWorkoutDay, getMuscleWorkout, getAllMuscleWorkouts };
