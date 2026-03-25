const router = require('express').Router();
const { getWorkoutPlan, getAllWorkouts, updateWorkoutDay } = require('../controllers/workoutController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getWorkoutPlan);
router.get('/all', protect, adminOnly, getAllWorkouts);
router.put('/:goal/:dayIndex', protect, adminOnly, updateWorkoutDay);

module.exports = router;
