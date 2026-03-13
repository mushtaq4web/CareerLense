const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const isPostgres = !!process.env.DATABASE_URL;

function dbGet(sql, params) {
  if (isPostgres) return db.query(sql, params).then(r => r.rows[0] || null);
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => err ? reject(err) : resolve(row || null));
  });
}

function dbAll(sql, params) {
  if (isPostgres) return db.query(sql, params).then(r => r.rows);
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
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

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const rows = await dbAll(
      isPostgres
        ? 'SELECT * FROM jobs WHERE "userId" = $1 ORDER BY "createdAt" DESC'
        : 'SELECT * FROM jobs WHERE userId = ? ORDER BY createdAt DESC',
      [req.userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Fetch jobs error:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Create job
router.post('/', async (req, res) => {
  try {
    const { company, role, status, notes, appliedDate, industry, responseDate } = req.body;
    if (!company || !role) return res.status(400).json({ error: 'Company and role are required' });

    const result = await dbRun(
      isPostgres
        ? `INSERT INTO jobs ("userId", company, role, status, notes, "appliedDate", industry, "responseDate")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
        : 'INSERT INTO jobs (userId, company, role, status, notes, appliedDate, industry, responseDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        req.userId, company, role,
        status || 'Applied',
        notes || '',
        appliedDate || new Date().toISOString().split('T')[0],
        industry || null,
        responseDate || null
      ]
    );

    res.status(201).json({
      message: 'Job added successfully',
      jobId: isPostgres ? result.id : result.lastID
    });
  } catch (error) {
    console.error('Create job error:', error.message);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { company, role, status, notes, appliedDate, industry, responseDate } = req.body;

    const existing = await dbGet(
      isPostgres ? 'SELECT "userId" FROM jobs WHERE id = $1' : 'SELECT userId FROM jobs WHERE id = ?',
      [id]
    );
    if (!existing) return res.status(404).json({ error: 'Job not found' });
    if (existing.userId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

    await dbRun(
      isPostgres
        ? `UPDATE jobs SET company = $1, role = $2, status = $3, notes = $4,
           "appliedDate" = $5, industry = $6, "responseDate" = $7 WHERE id = $8`
        : 'UPDATE jobs SET company = ?, role = ?, status = ?, notes = ?, appliedDate = ?, industry = ?, responseDate = ? WHERE id = ?',
      [company, role, status, notes, appliedDate, industry, responseDate, id]
    );

    res.json({ message: 'Job updated successfully' });
  } catch (error) {
    console.error('Update job error:', error.message);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await dbGet(
      isPostgres ? 'SELECT "userId" FROM jobs WHERE id = $1' : 'SELECT userId FROM jobs WHERE id = ?',
      [id]
    );
    if (!existing) return res.status(404).json({ error: 'Job not found' });
    if (existing.userId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

    await dbRun(
      isPostgres ? 'DELETE FROM jobs WHERE id = $1' : 'DELETE FROM jobs WHERE id = ?',
      [id]
    );

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error.message);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

module.exports = router;