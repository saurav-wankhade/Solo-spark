const pool = require('../config/db');

exports.getUserPoints = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT COALESCE(SUM(points_earned), 0) AS total_points
       FROM points
       WHERE user_id = $1`,
      [user_id]
    );

    res.json({ total_points: parseInt(result.rows[0].total_points) });
  } catch (err) {
    console.error('Error fetching points:', err);
    res.status(500).json({ error: 'Failed to fetch Spark Points' });
  }
};
