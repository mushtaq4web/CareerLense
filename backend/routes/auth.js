const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            db.run(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to create user' });
                    }

                    // Generate JWT token
                    const token = jwt.sign(
                        { userId: this.lastID, email },
                        process.env.JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    res.status(201).json({
                        message: 'User registered successfully',
                        token,
                        user: {
                            id: this.lastID,
                            name,
                            email
                        }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login user
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
