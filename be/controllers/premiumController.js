const User = require('../models/User');

// ── MOCK PAYMENT — simulates Razorpay order creation ─────────
const createOrder = async (req, res) => {
  const { plan } = req.body;
  const prices = { monthly: 299, quarterly: 799, yearly: 1999 };
  if (!prices[plan]) return res.status(400).json({ message: 'Invalid plan' });

  // Mock Razorpay order response
  const mockOrder = {
    id: `order_mock_${Date.now()}`,
    amount: prices[plan] * 100,
    currency: 'INR',
    plan,
    key: 'rzp_test_mock_key_gymtrainer',
  };
  res.json(mockOrder);
};

// ── MOCK PAYMENT VERIFY — activates premium ──────────────────
const verifyPayment = async (req, res) => {
  const { plan, orderId } = req.body;
  try {
    const expiry = new Date();
    if (plan === 'monthly')    expiry.setMonth(expiry.getMonth() + 1);
    if (plan === 'quarterly')  expiry.setMonth(expiry.getMonth() + 3);
    if (plan === 'yearly')     expiry.setFullYear(expiry.getFullYear() + 1);

    const user = await User.findByIdAndUpdate(req.user._id, {
      isPremium: true,
      premiumPlan: plan,
      premiumExpiry: expiry,
      premiumOrderId: orderId || `mock_${Date.now()}`,
    }, { new: true }).select('-password');

    res.json({ message: 'Premium activated!', user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── UPDATE PREMIUM PREFERENCES ───────────────────────────────
const updatePreferences = async (req, res) => {
  const { dietType, fitnessLevel, workoutDays, targetWeight, injuries, equipment } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      dietType, fitnessLevel, workoutDays, targetWeight, injuries, equipment,
    }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── PREMIUM CUSTOM WORKOUT PLAN ──────────────────────────────
const getPremiumWorkout = (req, res) => {
  const { goal, fitnessLevel = 'beginner', workoutDays = 5, equipment = 'full_gym', injuries = '' } = req.user;

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const restDays = 7 - workoutDays;

  // Exercise library by equipment
  const exercises = {
    chest: {
      full_gym: [
        { name: 'Barbell Bench Press', sets: fitnessLevel === 'advanced' ? 5 : 4, reps: fitnessLevel === 'beginner' ? 10 : 8 },
        { name: 'Incline Dumbbell Press', sets: 4, reps: 10 },
        { name: 'Cable Flyes', sets: 3, reps: 12 },
        { name: 'Dips', sets: 3, reps: fitnessLevel === 'beginner' ? 8 : 12 },
      ],
      home: [
        { name: 'Push-ups', sets: 4, reps: 20 },
        { name: 'Wide Push-ups', sets: 3, reps: 15 },
        { name: 'Diamond Push-ups', sets: 3, reps: 12 },
        { name: 'Pike Push-ups', sets: 3, reps: 10 },
      ],
      minimal: [
        { name: 'Push-ups', sets: 4, reps: 20 },
        { name: 'Resistance Band Chest Press', sets: 3, reps: 15 },
        { name: 'Diamond Push-ups', sets: 3, reps: 12 },
      ],
    },
    back: {
      full_gym: [
        { name: 'Deadlift', sets: fitnessLevel === 'advanced' ? 5 : 4, reps: fitnessLevel === 'beginner' ? 8 : 6 },
        { name: 'Pull-ups', sets: 4, reps: fitnessLevel === 'beginner' ? 6 : 10 },
        { name: 'Bent Over Row', sets: 4, reps: 10 },
        { name: 'Lat Pulldown', sets: 3, reps: 12 },
      ],
      home: [
        { name: 'Pull-ups', sets: 4, reps: 8 },
        { name: 'Inverted Rows', sets: 3, reps: 12 },
        { name: 'Superman Hold', sets: 3, reps: '30 sec' },
      ],
      minimal: [
        { name: 'Resistance Band Row', sets: 4, reps: 15 },
        { name: 'Pull-ups', sets: 3, reps: 8 },
        { name: 'Superman Hold', sets: 3, reps: '30 sec' },
      ],
    },
    legs: {
      full_gym: [
        { name: 'Barbell Squat', sets: fitnessLevel === 'advanced' ? 5 : 4, reps: fitnessLevel === 'beginner' ? 10 : 8 },
        { name: 'Romanian Deadlift', sets: 4, reps: 10 },
        { name: 'Leg Press', sets: 4, reps: 12 },
        { name: 'Leg Curl', sets: 3, reps: 12 },
        { name: 'Calf Raises', sets: 4, reps: 20 },
      ],
      home: [
        { name: 'Bodyweight Squats', sets: 4, reps: 20 },
        { name: 'Bulgarian Split Squat', sets: 3, reps: 12 },
        { name: 'Glute Bridge', sets: 4, reps: 20 },
        { name: 'Calf Raises', sets: 4, reps: 25 },
      ],
      minimal: [
        { name: 'Resistance Band Squat', sets: 4, reps: 20 },
        { name: 'Lunges', sets: 3, reps: 15 },
        { name: 'Glute Bridge', sets: 4, reps: 20 },
      ],
    },
    shoulders: {
      full_gym: [
        { name: 'Overhead Press', sets: 4, reps: 10 },
        { name: 'Lateral Raises', sets: 4, reps: 15 },
        { name: 'Face Pulls', sets: 3, reps: 15 },
        { name: 'Arnold Press', sets: 3, reps: 10 },
      ],
      home: [
        { name: 'Pike Push-ups', sets: 4, reps: 12 },
        { name: 'Lateral Raises', sets: 3, reps: 15 },
        { name: 'Front Raises', sets: 3, reps: 15 },
      ],
      minimal: [
        { name: 'Resistance Band Shoulder Press', sets: 4, reps: 15 },
        { name: 'Lateral Raises', sets: 3, reps: 15 },
        { name: 'Pike Push-ups', sets: 3, reps: 12 },
      ],
    },
    arms: {
      full_gym: [
        { name: 'Barbell Curl', sets: 4, reps: 12 },
        { name: 'Hammer Curl', sets: 3, reps: 12 },
        { name: 'Tricep Pushdown', sets: 4, reps: 12 },
        { name: 'Skull Crushers', sets: 3, reps: 10 },
      ],
      home: [
        { name: 'Diamond Push-ups', sets: 4, reps: 15 },
        { name: 'Chin-ups', sets: 3, reps: 8 },
        { name: 'Tricep Dips', sets: 4, reps: 15 },
      ],
      minimal: [
        { name: 'Resistance Band Curl', sets: 4, reps: 15 },
        { name: 'Resistance Band Tricep Extension', sets: 4, reps: 15 },
        { name: 'Diamond Push-ups', sets: 3, reps: 12 },
      ],
    },
    core: {
      full_gym: [
        { name: 'Plank', sets: 3, reps: '60 sec' },
        { name: 'Cable Crunch', sets: 3, reps: 15 },
        { name: 'Leg Raises', sets: 3, reps: 20 },
        { name: 'Russian Twist', sets: 3, reps: 20 },
      ],
      home: [
        { name: 'Plank', sets: 3, reps: '60 sec' },
        { name: 'Crunches', sets: 4, reps: 25 },
        { name: 'Leg Raises', sets: 3, reps: 20 },
        { name: 'Mountain Climbers', sets: 3, reps: 30 },
      ],
      minimal: [
        { name: 'Plank', sets: 3, reps: '60 sec' },
        { name: 'Crunches', sets: 4, reps: 25 },
        { name: 'Leg Raises', sets: 3, reps: 20 },
      ],
    },
  };

  const eq = equipment || 'full_gym';

  // Build adaptive split based on workoutDays
  const splits = {
    3: [
      { focus: 'Full Body A', groups: ['chest', 'back', 'core'] },
      { focus: 'Full Body B', groups: ['legs', 'shoulders', 'core'] },
      { focus: 'Full Body C', groups: ['chest', 'arms', 'core'] },
    ],
    4: [
      { focus: 'Chest + Triceps', groups: ['chest', 'arms'] },
      { focus: 'Back + Biceps', groups: ['back', 'arms'] },
      { focus: 'Legs', groups: ['legs', 'core'] },
      { focus: 'Shoulders + Core', groups: ['shoulders', 'core'] },
    ],
    5: [
      { focus: 'Chest + Triceps', groups: ['chest', 'arms'] },
      { focus: 'Back + Biceps', groups: ['back', 'arms'] },
      { focus: 'Legs', groups: ['legs'] },
      { focus: 'Shoulders + Core', groups: ['shoulders', 'core'] },
      { focus: 'Arms + Abs', groups: ['arms', 'core'] },
    ],
    6: [
      { focus: 'Chest', groups: ['chest'] },
      { focus: 'Back', groups: ['back'] },
      { focus: 'Legs', groups: ['legs'] },
      { focus: 'Shoulders', groups: ['shoulders'] },
      { focus: 'Arms', groups: ['arms'] },
      { focus: 'Core + Cardio', groups: ['core'] },
    ],
  };

  const days = workoutDays >= 6 ? 6 : workoutDays <= 3 ? 3 : workoutDays;
  const split = splits[days] || splits[5];

  const plan = allDays.map((day, i) => {
    if (i >= workoutDays) return { day, focus: 'Rest Day', exercises: [{ name: 'Light Stretching', sets: 1, reps: '15 min' }], isRest: true };
    const s = split[i % split.length];
    const exs = s.groups.flatMap(g => (exercises[g]?.[eq] || exercises[g]?.full_gym || []));
    return { day, focus: s.focus, exercises: exs, isRest: false };
  });

  res.json({ plan, level: fitnessLevel, equipment: eq, workoutDays, adaptive: true });
};

// ── PREMIUM CUSTOM DIET PLAN ─────────────────────────────────
const getPremiumDiet = (req, res) => {
  const { weight = 70, goal = 'maintain', bodyType = 'mesomorph', dietType = 'non_veg', fitnessLevel = 'beginner' } = req.user;

  let calories;
  const multiplier = fitnessLevel === 'advanced' ? 26 : fitnessLevel === 'intermediate' ? 25 : 24;
  if (goal === 'lose_fat')      calories = Math.round(weight * multiplier - 500);
  else if (goal === 'gain_muscle') calories = Math.round(weight * multiplier + 500);
  else calories = Math.round(weight * multiplier);

  const protein = Math.round(weight * (goal === 'gain_muscle' ? 2.2 : goal === 'lose_fat' ? 2.0 : 1.6));

  const vegPlans = {
    lose_fat: {
      breakfast: { name: 'Protein Oats + Fruits', items: ['1 bowl oats with almond milk', '1 scoop plant protein', '1 banana + berries', '5 soaked almonds', 'Green tea'], calories: 380 },
      lunch: { name: 'Dal + Roti + Salad', items: ['2 whole wheat rotis', '1 bowl moong dal', '100g paneer bhurji', '1 bowl cucumber tomato salad', '1 glass buttermilk'], calories: 480 },
      snack: { name: 'Sprouts Chaat', items: ['1 bowl mixed sprouts', '1 apple', '10 walnuts', '1 glass water'], calories: 220 },
      dinner: { name: 'Paneer Sabzi + Roti', items: ['150g paneer tikka', '1 bowl mixed vegetable sabzi', '1 roti', '1 bowl dal'], calories: 420 },
    },
    gain_muscle: {
      breakfast: { name: 'Paneer Paratha + Milk', items: ['2 paneer parathas with ghee', '1 glass full-fat milk', '1 banana', '10 cashews', '1 scoop plant protein shake'], calories: 750 },
      lunch: { name: 'Rajma Rice + Paneer', items: ['2 cups rice', '1 bowl rajma curry', '150g paneer', '1 bowl curd', '1 roti'], calories: 850 },
      snack: { name: 'Peanut Butter Shake', items: ['2 bread slices with peanut butter', '1 banana protein shake', '10 walnuts', '1 glass milk'], calories: 500 },
      dinner: { name: 'Chana Dal + Paneer', items: ['3 rotis', '1 bowl chana dal', '100g paneer sabzi', '1 bowl curd'], calories: 680 },
    },
    maintain: {
      breakfast: { name: 'Poha + Milk', items: ['1 bowl poha with peanuts', '1 glass milk', '1 fruit', '5 almonds'], calories: 450 },
      lunch: { name: 'Dal Rice + Sabzi', items: ['1.5 cups rice', '1 bowl dal', '1 bowl seasonal sabzi', '100g paneer', '1 bowl curd'], calories: 580 },
      snack: { name: 'Makhana + Chai', items: ['1 bowl roasted makhana', '1 cup chai', '1 fruit'], calories: 250 },
      dinner: { name: 'Roti + Dal + Sabzi', items: ['2 rotis', '1 bowl dal', '1 bowl sabzi', '1 small bowl curd'], calories: 450 },
    },
  };

  const nonVegPlans = {
    lose_fat: {
      breakfast: { name: 'Egg White Omelette + Oats', items: ['4 egg whites omelette with veggies', '1 bowl oats', '1 banana', 'Green tea', '5 almonds'], calories: 360 },
      lunch: { name: 'Chicken + Dal + Roti', items: ['150g grilled chicken breast', '2 whole wheat rotis', '1 bowl moong dal', '1 bowl salad', '1 glass buttermilk'], calories: 490 },
      snack: { name: 'Boiled Eggs + Fruits', items: ['2 boiled eggs', '1 apple', '10 almonds', '1 glass water'], calories: 210 },
      dinner: { name: 'Grilled Fish + Sabzi', items: ['200g grilled fish', '1 bowl mixed vegetable sabzi', '1 roti', '1 bowl dal'], calories: 410 },
    },
    gain_muscle: {
      breakfast: { name: 'Eggs + Paratha + Milk', items: ['4 whole eggs scrambled', '2 parathas with ghee', '1 glass full-fat milk', '1 banana', '1 scoop whey protein'], calories: 800 },
      lunch: { name: 'Chicken Rice + Dal', items: ['200g chicken curry', '2 cups rice', '1 bowl dal', '1 bowl curd', '1 roti'], calories: 900 },
      snack: { name: 'Tuna Sandwich + Shake', items: ['2 bread slices with tuna', '1 banana protein shake', '10 walnuts'], calories: 480 },
      dinner: { name: 'Mutton/Chicken + Roti', items: ['200g chicken/mutton curry', '3 rotis', '1 bowl dal', '1 bowl curd'], calories: 700 },
    },
    maintain: {
      breakfast: { name: 'Eggs + Poha', items: ['2 whole eggs', '1 bowl poha', '1 glass milk', '1 fruit'], calories: 460 },
      lunch: { name: 'Chicken + Dal Rice', items: ['150g chicken', '1.5 cups rice', '1 bowl dal', '1 bowl sabzi', '1 bowl curd'], calories: 600 },
      snack: { name: 'Boiled Eggs + Chai', items: ['2 boiled eggs', '1 cup chai', '2 digestive biscuits'], calories: 240 },
      dinner: { name: 'Fish/Chicken + Roti', items: ['150g grilled fish or chicken', '2 rotis', '1 bowl sabzi', '1 bowl dal'], calories: 460 },
    },
  };

  const plan = dietType === 'veg' ? vegPlans[goal] || vegPlans.maintain : nonVegPlans[goal] || nonVegPlans.maintain;

  res.json({ calories, protein, dietType, goal, fitnessLevel, meals: plan, adaptive: true });
};

// ── GET PREMIUM STATUS ────────────────────────────────────────
const getPremiumStatus = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  const isActive = user.isPremium && user.premiumExpiry && new Date(user.premiumExpiry) > new Date();
  if (!isActive && user.isPremium) {
    await User.findByIdAndUpdate(req.user._id, { isPremium: false });
  }
  res.json({ isPremium: isActive, premiumPlan: user.premiumPlan, premiumExpiry: user.premiumExpiry, preferences: { dietType: user.dietType, fitnessLevel: user.fitnessLevel, workoutDays: user.workoutDays, targetWeight: user.targetWeight, injuries: user.injuries, equipment: user.equipment } });
};

module.exports = { createOrder, verifyPayment, updatePreferences, getPremiumWorkout, getPremiumDiet, getPremiumStatus };
