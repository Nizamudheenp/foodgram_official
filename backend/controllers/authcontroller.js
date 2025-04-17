const db = require("../db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [existingUser] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        )

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user[0].password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        

        const token = jwt.sign(
            { id: user[0].id, email: user[0].email, role: user[0].role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        
        res.json({ message: 'Login successful',token ,user: {
            id: user[0].id,
            username: user[0].username,
            email: user[0].email,
            role: user[0].role
          }
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}