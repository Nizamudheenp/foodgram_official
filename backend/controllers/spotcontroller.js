const db = require("../db");

exports.submitspot = async (req,res)=>{
    const { name, description, district, location, user_id } = req.body;

    try {
        await db.query(
            `INSERT INTO spots (name, description, district, location, user_id, is_verified) 
             VALUES (?, ?, ?, ?, ?, 0)`,
            [name, description, district, location, user_id]
          );
      
          res.status(201).json({ message: 'Food spot submitted for review!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}