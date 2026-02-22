const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Get dashboard analytics
router.get('/dashboard', (req, res) => {
    const userId = req.userId;

    // Get all jobs for calculations
    db.all(
        'SELECT * FROM jobs WHERE userId = ?',
        [userId],
        (err, jobs) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch analytics' });
            }

            const totalApplications = jobs.length;
            const statusCounts = {
                applied: jobs.filter(j => j.status === 'Applied').length,
                interview: jobs.filter(j => j.status === 'Interview').length,
                offer: jobs.filter(j => j.status === 'Offer').length,
                rejected: jobs.filter(j => j.status === 'Rejected').length,
            };

            // Calculate success rate (interviews + offers / total)
            const successfulApps = statusCounts.interview + statusCounts.offer;
            const successRate = totalApplications > 0
                ? ((successfulApps / totalApplications) * 100).toFixed(1)
                : 0;

            // Calculate average response time (for jobs with responseDate)
            const jobsWithResponse = jobs.filter(j => j.responseDate && j.appliedDate);
            let avgResponseTime = 0;
            if (jobsWithResponse.length > 0) {
                const totalDays = jobsWithResponse.reduce((sum, job) => {
                    const applied = new Date(job.appliedDate);
                    const response = new Date(job.responseDate);
                    const days = Math.floor((response - applied) / (1000 * 60 * 60 * 24));
                    return sum + days;
                }, 0);
                avgResponseTime = (totalDays / jobsWithResponse.length).toFixed(1);
            }

            // Industry insights
            const industryMap = {};
            jobs.forEach(job => {
                const industry = job.industry || 'Other';
                if (!industryMap[industry]) {
                    industryMap[industry] = {
                        industry,
                        applications: 0,
                        interviews: 0,
                        offers: 0
                    };
                }
                industryMap[industry].applications++;
                if (job.status === 'Interview') industryMap[industry].interviews++;
                if (job.status === 'Offer') industryMap[industry].offers++;
            });

            const industryInsights = Object.values(industryMap).map(item => ({
                ...item,
                successRate: item.applications > 0
                    ? ((item.interviews + item.offers) / item.applications * 100).toFixed(1)
                    : 0
            })).sort((a, b) => b.applications - a.applications);

            res.json({
                totalApplications,
                successRate: parseFloat(successRate),
                avgResponseTime: parseFloat(avgResponseTime),
                statusBreakdown: statusCounts,
                industryInsights
            });
        }
    );
});

// Get resume performance metrics
router.get('/resumes', (req, res) => {
    const userId = req.userId;

    db.all(
        `SELECT 
            r.id, 
            r.title, 
            r.template,
            r.updatedAt,
            COUNT(CASE WHEN re.eventType = 'view' THEN 1 END) as views,
            COUNT(CASE WHEN re.eventType = 'download' THEN 1 END) as downloads
        FROM resumes r
        LEFT JOIN resume_events re ON r.id = re.resumeId
        WHERE r.userId = ?
        GROUP BY r.id
        ORDER BY r.updatedAt DESC`,
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch resume analytics' });
            }

            // Template popularity
            const templateCounts = {};
            rows.forEach(row => {
                const template = row.template || 'classic';
                templateCounts[template] = (templateCounts[template] || 0) + 1;
            });

            res.json({
                resumes: rows,
                templatePopularity: Object.entries(templateCounts).map(([template, count]) => ({
                    template,
                    count
                }))
            });
        }
    );
});

// Log resume event (view or download)
router.post('/resume-event', (req, res) => {
    const { resumeId, eventType } = req.body;
    const userId = req.userId;

    if (!resumeId || !eventType) {
        return res.status(400).json({ error: 'resumeId and eventType are required' });
    }

    // Verify resume ownership
    db.get(
        'SELECT userId FROM resumes WHERE id = ?',
        [resumeId],
        (err, row) => {
            if (err || !row) {
                return res.status(404).json({ error: 'Resume not found' });
            }

            if (row.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Log the event
            db.run(
                'INSERT INTO resume_events (userId, resumeId, eventType) VALUES (?, ?, ?)',
                [userId, resumeId, eventType],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to log event' });
                    }
                    res.json({ message: 'Event logged successfully' });
                }
            );
        }
    );
});

module.exports = router;
