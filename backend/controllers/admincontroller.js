const db = require('../db');

exports.getPendingSpots = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM spots WHERE is_verified = 0");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pending spots" });
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
  