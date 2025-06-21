const express = require('express');
const auth = require('../middleware/auth');
const {
  submitReflection,
  getUserReflections,
  deleteReflection
} = require('../controllers/reflectionController');

const router = express.Router();

router.post('/submit', auth, submitReflection);
router.get('/me', auth, getUserReflections);
router.delete('/:id', auth, deleteReflection);

module.exports = router;
