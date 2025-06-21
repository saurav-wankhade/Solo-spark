const pool = require('../config/db');

exports.getAllRewards = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rewards ORDER BY cost ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
};

exports.claimReward = async (req, res) => {
  const user_id = req.user.id;
  const reward_id = req.body.reward_id;

  try {
    // 1. Check if reward exists
    const reward = await pool.query('SELECT * FROM rewards WHERE id = $1', [reward_id]);
    if (reward.rowCount === 0) return res.status(404).json({ error: 'Reward not found' });

    const cost = reward.rows[0].cost;

    // 2. Check user’s total points
    const points = await pool.query(
      'SELECT COALESCE(SUM(points_earned), 0) AS total FROM points WHERE user_id = $1',
      [user_id]
    );
    const totalPoints = parseInt(points.rows[0].total);

    // 3. Check if already redeemed
    const claimed = await pool.query(
      'SELECT 1 FROM redemptions WHERE user_id = $1 AND reward_id = $2',
      [user_id, reward_id]
    );

    if (claimed.rowCount > 0) {
      return res.status(400).json({ error: 'Reward already claimed' });
    }

    if (totalPoints < cost) {
      return res.status(400).json({ error: 'Not enough Spark Points' });
    }

    // 4. Deduct cost by adding negative points
    await pool.query('INSERT INTO points (user_id, points_earned) VALUES ($1, $2)', [
      user_id,
      -cost,
    ]);

    // 5. Insert redemption
    await pool.query(
      'INSERT INTO redemptions (user_id, reward_id) VALUES ($1, $2)',
      [user_id, reward_id]
    );

    res.json({ message: 'Reward claimed successfully!' });
  } catch (err) {
    console.error('Error claiming reward:', err);
    res.status(500).json({ error: 'Reward claim failed' });
  }
};

exports.getClaimedRewards = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT r.title, r.description, r.cost, re.redeemed_at
       FROM redemptions re
       JOIN rewards r ON r.id = re.reward_id
       WHERE re.user_id = $1
       ORDER BY re.redeemed_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching claimed rewards:', err);
    res.status(500).json({ error: 'Could not fetch claimed rewards' });
  }
};
