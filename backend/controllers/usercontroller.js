const db = require("../db");

exports.submitspot = async (req,res)=>{
    const { name, description, district, location } = req.body;
    const userId = req.user.id; 
    const image = req.file?.path || null;

    try {
        await db.query(
            `INSERT INTO spots (name, description, district, location, user_id, is_verified,image) 
             VALUES (?, ?, ?, ?, ?, 0,?)`,
            [name, description, district, location, userId , image]
          );
      
          res.status(201).json({ message: 'Food spot submitted for review!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.addReview = async (req, res) => {
    const { spot_id, rating, comment } = req.body;
    const userId = req.user.id; 
    try {
      const [existing] = await db.query(
        "SELECT * FROM reviews WHERE user_id = ? AND spot_id = ?",
        [userId, spot_id]
      );
  
      if (existing.length > 0) {
        return res.status(400).json({ message: "You have already reviewed this spot." });
      }
  
      await db.query(
        "INSERT INTO reviews (user_id, spot_id, rating, comment) VALUES (?, ?, ?, ?)",
        [userId, spot_id, rating, comment]
      );
  
      res.status(201).json({ message: "Review added successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add review" });
    }
  };

  exports.getReviewsBySpot = async (req, res) => {
    const spotId = req.params.spotId;
  
    try {
      const [reviews] = await db.query(
        `SELECT reviews.*, users.username 
         FROM reviews 
         JOIN users ON reviews.user_id = users.id 
         WHERE spot_id = ? ORDER BY created_at DESC`,
        [spotId]
      );
      res.json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get reviews" });
    }
  };

  exports.getRatingsSummary = async (req, res) => {
    try {
      const [data] = await db.query(`
        SELECT 
          spot_id, 
          ROUND(AVG(rating), 1) AS average_rating, 
          COUNT(*) AS total_reviews 
        FROM reviews 
        GROUP BY spot_id
      `);
  
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get ratings summary" });
    }
  };
  
  exports.getTopRatedSpots = async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT 
          s.*, 
          IFNULL(AVG(r.rating), 0) as avg_rating 
        FROM spots s
        LEFT JOIN reviews r ON s.id = r.spot_id
        WHERE s.approved = TRUE
        GROUP BY s.id
        ORDER BY avg_rating DESC
        LIMIT 10;
      `);
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch top rated spots" });
    }
  };

  exports.getSpotsbydistrict = async (req, res) => {
    const { district } = req.query;
    let query = "SELECT * FROM spots WHERE is_verified = TRUE";
    let params = [];
  
    if (district) {
      query += " AND district = ?";
      params.push(district);
    }
  
    try {
      const [spots] = await db.query(query, params);
      res.json(spots);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch spots" });
    }
  };

exports.searchspot =  async (req, res) => {
  const { query } = req.query; 

  try {
    const [spots] = await db.query(
      'SELECT * FROM spots WHERE name LIKE ? AND is_verified = 1', 
      [`%${query}%`] 
    );
    
    res.json(spots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search spots" });
  }
};


  exports.getProfile = async(req,res)=>{
    const userId = req.user.id

    try {
      const [users] = await db.query('SELECT id , username, email FROM users WHERE id = ?', [userId])
      if (users.length === 0){
        return res.status(404).json({message : 'user not found'})
      }
      res.status(200).json(users[0])
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  exports.deleteAccount = async (req, res) => {
    const userId = req.user.id;
  
    try {
      await db.query('DELETE FROM users WHERE id = ?', [userId]);
      res.json({ message: 'Account deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  