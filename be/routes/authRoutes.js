const router = require('express').Router();
const { signup, login, getProfile, updateProfile, forgotPassword, verifyOtp, resetPassword, sendPhoneOtp, verifyPhoneOtp } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/phone-otp', sendPhoneOtp);
router.post('/phone-verify', verifyPhoneOtp);

module.exports = router;
