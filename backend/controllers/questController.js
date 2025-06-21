const pool = require('../config/db'); 

exports.getDailyQuest = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM quests WHERE frequency = $1 ORDER BY RANDOM() LIMIT 1',
    ['daily']
  );
  res.json(result.rows[0]);
};

exports.getAllQuests = async (req, res) => {
  const result = await pool.query('SELECT * FROM quests ORDER BY id DESC');
  res.json(result.rows);
}; 

exports.getPersonalizedQuest = async (req, res) => {
  const user_id = req.user.id;
  const frequency = req.query.frequency || 'daily';

  try {
    const { rows: topNeedsRows } = await pool.query(
      `SELECT unnest(emotional_needs) AS need, COUNT(*) AS freq
       FROM user_quests
       WHERE user_id = $1
       GROUP BY need
       ORDER BY freq DESC
       LIMIT 3`,
      [user_id]
    );

    if (topNeedsRows.length === 0) {
      return res.status(400).json({ error: 'Not enough user data to personalize quest' });
    }

    const topNeeds = topNeedsRows.map(row => row.need);

    const { rows: quests } = await pool.query(
      `SELECT *
       FROM quests
       WHERE tags && $1::text[]
         AND frequency = $2
       ORDER BY random()
       LIMIT 1`,
      [topNeeds, frequency]
    );

    if (quests.length === 0) {
      return res.status(404).json({ error: 'No matching quest found' });
    }

    const quest = quests[0];

    const exists = await pool.query(
      `SELECT 1 FROM user_quests 
       WHERE user_id = $1 AND quest_id = $2 
         AND DATE(assigned_at) = CURRENT_DATE`,
      [user_id, quest.id]
    );

    if (exists.rowCount > 0) {
      return res.json({ message: 'Quest already assigned today', quest });
    }

    res.json(quest);
  } catch (err) {
    console.error('Fetch quest error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

