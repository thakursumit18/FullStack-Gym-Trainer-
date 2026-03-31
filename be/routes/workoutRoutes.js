const router = require('express').Router();
const { getWorkoutPlan, getAllWorkouts, updateWorkoutDay, getMuscleWorkout, getAllMuscleWorkouts } = require('../controllers/workoutController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getWorkoutPlan);
router.get('/muscles', protect, getAllMuscleWorkouts);
router.get('/muscles/:muscle', protect, getMuscleWorkout);
router.get('/all', protect, adminOnly, getAllWorkouts);
router.put('/:goal/:dayIndex', protect, adminOnly, updateWorkoutDay);

module.exports = router;
