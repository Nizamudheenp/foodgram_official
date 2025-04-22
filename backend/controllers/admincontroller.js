const db = require('../db');

exports.getPendingSpots = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, GROUP_CONCAT(si.image_url) AS images
      FROM spots s
      LEFT JOIN spot_images si ON s.id = si.spot_id
      WHERE s.is_verified = 0
      GROUP BY s.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pending spots" });
  }
};


exports.getApprovedSpots = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, GROUP_CONCAT(si.image_url) AS images
      FROM spots s
      LEFT JOIN spot_images si ON s.id = si.spot_id
      WHERE s.is_verified = 1
      GROUP BY s.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch approved spots" });
  }
};


exports.approveSpot = async (req, res) => {
    const spotId = req.params.id;
    try {
      const [result] = await db.query("UPDATE spots SET is_verified = 1 WHERE id = ?", [spotId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Spot not found" });
      }
      res.json({ message: "Spot approved successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to approve spot" });
    }
  };

  exports.deleteSpot = async (req, res) => {
    const spotId = req.params.id;
  
    try {
      const [result] = await db.query('DELETE FROM spots WHERE id = ?', [spotId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Spot not found or already deleted.' });
      }
  
      return res.status(200).json({ message: 'Spot deleted successfully.' });
    } catch (err) {
      console.error('Error deleting spot:', err);
      return res.status(500).json({ message: 'Server error while deleting spot.' });
    }
  };
  
  