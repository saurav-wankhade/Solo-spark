const express = require('express');
const { getPersonalizedQuest, getDailyQuest, getAllQuests } = require('../controllers/questController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/daily', auth, getDailyQuest);
router.get('/all', auth, getAllQuests);
router.get('/personalized', auth, getPersonalizedQuest);

module.exports = router;
