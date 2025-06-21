const express = require('express');
const auth = require('../middleware/auth');
const {
  getAllRewards,
  claimReward,
  getClaimedRewards
} = require('../controllers/rewardController');

const router = express.Router();

router.get('/', auth, getAllRewards);
router.post('/claim', auth, claimReward);
router.get('/claimed', auth, getClaimedRewards);

module.exports = router;
