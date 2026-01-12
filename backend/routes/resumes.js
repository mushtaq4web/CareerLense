const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Get all resumes for authenticated user
router.get('/', (req, res) => {
    db.all(
        'SELECT * FROM resumes WHERE userId = ? ORDER BY updatedAt DESC',
        [req.userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch resumes' });
            }

            // Parse JSON content for each resume
            const resumes = rows.map(row => ({
                ...row,
                content: JSON.parse(row.content)
            }));

            res.json(resumes);
        }
    );
});

// Create new resume
router.post('/', (req, res) => {
    const { title, content, template } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const contentJSON = JSON.stringify(content);

    db.run(
        'INSERT INTO resumes (userId, title, content, template) VALUES (?, ?, ?, ?)',
        [req.userId, title, contentJSON, template || 'classic'],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create resume' });
            }

            res.status(201).json({
                message: 'Resume created successfully',
                resumeId: this.lastID
            });
        }
    );
});

// Update resume
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, content, template } = req.body;

    // First verify ownership
    db.get(
        'SELECT userId FROM resumes WHERE id = ?',
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!row) {
                return res.status(404).json({ error: 'Resume not found' });
            }

            if (row.userId !== req.userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Update resume
            const contentJSON = JSON.stringify(content);

            db.run(
                'UPDATE resumes SET title = ?, content = ?, template = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
                [title, contentJSON, template, id],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to update resume' });
                    }

                    res.json({ message: 'Resume updated successfully' });
                }
            );
        }
    );
});

// Delete resume
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // First verify ownership
    db.get(
        'SELECT userId FROM resumes WHERE id = ?',
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!row) {
                return res.status(404).json({ error: 'Resume not found' });
            }

            if (row.userId !== req.userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Delete resume
            db.run('DELETE FROM resumes WHERE id = ?', [id], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete resume' });
                }

                res.json({ message: 'Resume deleted successfully' });
            });
        }
    );
});

module.exports = router;
