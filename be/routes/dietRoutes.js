const router = require('express').Router();
const { getDietPlan, getAllDietPlans } = require('../controllers/dietController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getDietPlan);
router.get('/all', protect, adminOnly, getAllDietPlans);

module.exports = router;
