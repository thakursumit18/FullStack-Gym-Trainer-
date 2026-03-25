const router = require('express').Router();
const { logProgress, getProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.post('/', protect, logProgress);
router.get('/', protect, getProgress);

module.exports = router;
