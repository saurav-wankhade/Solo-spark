const pool = require('../config/db');

exports.submitReflection = async (req, res) => {
  const {
    quest_id,
    reflection_text,
    photo_url,
    audio_url,
    mood,
    emotional_needs
  } = req.body;

  const user_id = req.user.id;

  if (!quest_id) {
    return res.status(400).json({ error: 'Missing quest_id in request body' });
  }

  try {
    await pool.query(
      `UPDATE user_quests SET 
         reflection_text = $1, photo_url = $2, audio_url = $3,
         mood = $4, emotional_needs = $5, completed_at = NOW()
       WHERE user_id = $6 AND quest_id = $7`,
      [reflection_text, photo_url, audio_url, mood, emotional_needs, user_id, quest_id]
    );

    await pool.query(
      `INSERT INTO points (user_id, points_earned)
       VALUES ($1, 10)`,
      [user_id]
    );

    res.json({ message: 'Reflection submitted and points awarded' });
  } catch (err) {
    console.error('Error submitting reflection:', err);
    res.status(500).json({ error: 'Could not submit reflection' });
  }
};



exports.getUserReflections = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT uq.*, q.title FROM user_quests uq
       JOIN quests q ON uq.quest_id = q.id
       WHERE uq.user_id = $1
       ORDER BY uq.completed_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reflections:', err);
    res.status(500).json({ error: 'Failed to fetch reflections' });
  }
};

exports.deleteReflection = async (req, res) => {
  const user_id = req.user.id;
  const reflection_id = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM user_quests WHERE id = $1 AND user_id = $2 RETURNING *',
      [reflection_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Unauthorized or reflection not found' });
    }

    res.json({ message: 'Reflection deleted' });
  } catch (err) {
    console.error('Error deleting reflection:', err);
    res.status(500).json({ error: 'Could not delete reflection' });
  }
};
