const SpotDB = require('../models/SpotModel');


exports.getPendingSpots = async (req, res) => {
  try {
    const pendingSpots = await SpotDB.find({ is_verified: false });
    res.json(pendingSpots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pending spots" });
  }
};

exports.getApprovedSpots = async (req, res) => {
  try {
    const approvedSpots = await SpotDB.find({ is_verified: true });
    res.json(approvedSpots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch approved spots" });
  }
};

exports.approveSpot = async (req, res) => {
  const spotId = req.params.id;
  try {
    const spot = await SpotDB.findById(spotId);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }
    spot.is_verified = true;
    await spot.save();
    res.json({ message: "Spot approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve spot" });
  }
};

exports.editSpot = async (req, res) => {
  const spotId = req.params.id;
  const { name, description, district, location } = req.body;
  try {
    const spot = await SpotDB.findById(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }
    spot.name = name;
    spot.description = description;
    spot.district = district;
    spot.location = location;
    await spot.save();
    res.json({ message: "Spot updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update spot" });
  }
};

exports.deleteSpot = async (req, res) => {
  const spotId = req.params.id;
  try {
    const result = await SpotDB.findByIdAndDelete(spotId);
    if (!result) {
      return res.status(404).json({ message: "Spot not found or already deleted." });
    }
    return res.status(200).json({ message: "Spot deleted successfully." });
  } catch (err) {
    console.error("Error deleting spot:", err);
    return res.status(500).json({ message: "Server error while deleting spot." });
  }
};
