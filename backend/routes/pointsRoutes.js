const express = require('express');
const auth = require('../middleware/auth');
const { getUserPoints } = require('../controllers/pointsController');

const router = express.Router();

router.get('/me', auth, getUserPoints);

module.exports = router;
