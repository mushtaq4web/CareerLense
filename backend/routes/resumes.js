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

// Get all resumes
router.get('/', async (req, res) => {
  try {
    const rows = await dbAll(
      isPostgres
        ? 'SELECT * FROM resumes WHERE "userId" = $1 ORDER BY "updatedAt" DESC'
        : 'SELECT * FROM resumes WHERE userId = ? ORDER BY updatedAt DESC',
      [req.userId]
    );

    const resumes = rows.map(row => {
      let parsedContent = {};
      try { parsedContent = JSON.parse(row.content); } catch (_) {}
      return { ...row, content: parsedContent };
    });

    res.json(resumes);
  } catch (error) {
    console.error('Fetch resumes error:', error.message);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Create resume
router.post('/', async (req, res) => {
  try {
    const { title, content, template } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

    const contentJSON = JSON.stringify(content);

    const result = await dbRun(
      isPostgres
        ? 'INSERT INTO resumes ("userId", title, content, template) VALUES ($1, $2, $3, $4) RETURNING id'
        : 'INSERT INTO resumes (userId, title, content, template) VALUES (?, ?, ?, ?)',
      [req.userId, title, contentJSON, template || 'classic']
    );

    res.status(201).json({
      message: 'Resume created successfully',
      resumeId: isPostgres ? result.id : result.lastID
    });
  } catch (error) {
    console.error('Create resume error:', error.message);
    res.status(500).json({ error: 'Failed to create resume', details: error.message });
  }
});

// Update resume
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, template } = req.body;

    const existing = await dbGet(
      isPostgres ? 'SELECT "userId" FROM resumes WHERE id = $1' : 'SELECT userId FROM resumes WHERE id = ?',
      [id]
    );
    if (!existing) return res.status(404).json({ error: 'Resume not found' });

    const ownerId = isPostgres ? existing.userId : existing.userId;
    if (ownerId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

    const contentJSON = JSON.stringify(content);

    await dbRun(
      isPostgres
        ? 'UPDATE resumes SET title = $1, content = $2, template = $3, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $4'
        : 'UPDATE resumes SET title = ?, content = ?, template = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [title, contentJSON, template, id]
    );

    res.json({ message: 'Resume updated successfully' });
  } catch (error) {
    console.error('Update resume error:', error.message);
    res.status(500).json({ error: 'Failed to update resume', details: error.message });
  }
});

// Delete resume
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await dbGet(
      isPostgres ? 'SELECT "userId" FROM resumes WHERE id = $1' : 'SELECT userId FROM resumes WHERE id = ?',
      [id]
    );
    if (!existing) return res.status(404).json({ error: 'Resume not found' });
    if ((isPostgres ? existing.userId : existing.userId) !== req.userId)
      return res.status(403).json({ error: 'Unauthorized' });

    await dbRun(
      isPostgres ? 'DELETE FROM resumes WHERE id = $1' : 'DELETE FROM resumes WHERE id = ?',
      [id]
    );

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error.message);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

module.exports = router;