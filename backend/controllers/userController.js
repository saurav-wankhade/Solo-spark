const pool = require('../config/db');

exports.updateUserProfile = async (req, res) => {
  const user_id = req.user.id;
  const { personality_traits, default_moods, preferred_needs } = req.body;

  try {
    await pool.query(
      `UPDATE users SET
        personality_traits = $1,
        default_moods = $2,
        preferred_needs = $3
       WHERE id = $4`,
      [personality_traits, default_moods, preferred_needs, user_id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update failed:', err);
    res.status(500).json({ error: 'Could not update profile' });
  }
};
