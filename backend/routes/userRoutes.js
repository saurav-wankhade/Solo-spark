const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');
const { updateUserProfile } = require('../controllers/userController');

// ✅ Assign a quest to a user (auto or manual)
router.post('/assign-quest', auth, async (req, res) => {
    const user_id = req.user.id;
  
    // ✅ Extract and validate quest_id
    const quest_id = req.body?.quest_id;
    const frequency = req.body?.frequency;
  
    if (!quest_id) {
      console.error('❌ quest_id is NOT defined. Body was:', req.body);
      return res.status(400).json({ error: 'quest_id is required' });
    }
  
    try {
      const exists = await pool.query(
        'SELECT 1 FROM user_quests WHERE user_id = $1 AND quest_id = $2',
        [user_id, quest_id]
      );
  
      if (exists.rowCount === 0) {
        await pool.query(
          'INSERT INTO user_quests (user_id, quest_id) VALUES ($1, $2)',
          [user_id, quest_id]
        );
      }
  
      res.json({ assigned: true });
    } catch (err) {
      console.error('Error assigning quest:', err);
      res.status(500).json({ error: 'Failed to assign quest' });
    }
  });
  

// ✅ Onboarding route
router.patch('/profile', auth, updateUserProfile);

module.exports = router;
