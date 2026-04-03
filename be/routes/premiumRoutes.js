const router = require('express').Router();
const { createOrder, verifyPayment, updatePreferences, getPremiumWorkout, getPremiumDiet, getPremiumStatus } = require('../controllers/premiumController');
const { protect } = require('../middleware/auth');

router.get('/status', protect, getPremiumStatus);
router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.put('/preferences', protect, updatePreferences);
router.get('/workout', protect, getPremiumWorkout);
router.get('/diet', protect, getPremiumDiet);

module.exports = router;
