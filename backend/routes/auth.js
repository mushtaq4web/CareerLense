const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../database');

const router = express.Router();
const isPostgres = !!process.env.DATABASE_URL;

// =====================
// DB Helpers
// =====================
function dbGet(sql, params) {
  if (isPostgres) return db.query(sql, params).then(r => r.rows[0] || null);
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => err ? reject(err) : resolve(row || null));
  });
}

function dbRun(sql, params) {
  if (isPostgres) return db.query(sql, params).then(r => r.rows[0] || null);
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      err ? reject(err) : resolve({ lastID: this.lastID });
    });
  });
}

// =====================
// Email Transporter
// =====================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================
// Register
// =====================
router.post('/register', async (req, res) => {
  try {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = await dbGet(
      isPostgres ? 'SELECT id FROM users WHERE email = $1' : 'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await dbRun(
      isPostgres
        ? 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id'
        : 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const userId = isPostgres ? result.id : result.lastID;
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email }
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================
// Login
// =====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await dbGet(
      isPostgres ? 'SELECT * FROM users WHERE email = $1' : 'SELECT * FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================
// Forgot Password
// =====================
router.post('/forgot-password', async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await dbGet(
      isPostgres ? 'SELECT id, name FROM users WHERE email = $1' : 'SELECT id, name FROM users WHERE email = ?',
      [email]
    );

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent' });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = isPostgres
      ? new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
      : new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Save token to user record
    await dbRun(
      isPostgres
        ? 'UPDATE users SET "resetToken" = $1, "resetTokenExpiry" = $2 WHERE id = $3'
        : 'UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?',
      [resetTokenHash, resetTokenExpiry, user.id]
    );

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

    await transporter.sendMail({
      from: `"CareerLense" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your CareerLense password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Reset your password</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your CareerLense password. Click the button below to set a new password:</p>
          <a href="${resetUrl}"
             style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px;
                    border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: 'If that email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// =====================
// Reset Password
// =====================
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password)
      return res.status(400).json({ error: 'All fields are required' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await dbGet(
      isPostgres
        ? 'SELECT id, "resetToken", "resetTokenExpiry" FROM users WHERE email = $1'
        : 'SELECT id, resetToken, resetTokenExpiry FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (!user || user.resetToken !== tokenHash) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }

    if (new Date(user.resetTokenExpiry) < new Date()) {
      return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbRun(
      isPostgres
        ? 'UPDATE users SET password = $1, "resetToken" = NULL, "resetTokenExpiry" = NULL WHERE id = $2'
        : 'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;