const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Get all jobs for authenticated user
router.get('/', (req, res) => {
    db.all(
        'SELECT * FROM jobs WHERE userId = ? ORDER BY createdAt DESC',
        [req.userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch jobs' });
            }

            res.json(rows);
        }
    );
});

// Create new job
router.post('/', (req, res) => {
    const { company, role, status, notes, appliedDate } = req.body;

    if (!company || !role) {
        return res.status(400).json({ error: 'Company and role are required' });
    }

    db.run(
        'INSERT INTO jobs (userId, company, role, status, notes, appliedDate) VALUES (?, ?, ?, ?, ?, ?)',
        [req.userId, company, role, status || 'Applied', notes || '', appliedDate || new Date().toISOString().split('T')[0]],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create job' });
            }

            res.status(201).json({
                message: 'Job added successfully',
                jobId: this.lastID
            });
        }
    );
});

// Update job
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { company, role, status, notes, appliedDate } = req.body;

    // First verify ownership
    db.get(
        'SELECT userId FROM jobs WHERE id = ?',
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!row) {
                return res.status(404).json({ error: 'Job not found' });
            }

            if (row.userId !== req.userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Update job
            db.run(
                'UPDATE jobs SET company = ?, role = ?, status = ?, notes = ?, appliedDate = ? WHERE id = ?',
                [company, role, status, notes, appliedDate, id],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to update job' });
                    }

                    res.json({ message: 'Job updated successfully' });
                }
            );
        }
    );
});

// Delete job
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // First verify ownership
    db.get(
        'SELECT userId FROM jobs WHERE id = ?',
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!row) {
                return res.status(404).json({ error: 'Job not found' });
            }

            if (row.userId !== req.userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Delete job
            db.run('DELETE FROM jobs WHERE id = ?', [id], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete job' });
                }

                res.json({ message: 'Job deleted successfully' });
            });
        }
    );
});

module.exports = router;
