const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Apply for a job
router.post('/apply/:jobId', auth, async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { jobId } = req.params;

        // Check if job exists
        const [jobs] = await db.query('SELECT * FROM jobs WHERE id = ?', [jobId]);
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const [existingApplications] = await db.query(
            'SELECT * FROM applications WHERE user_id = ? AND job_id = ?',
            [userId, jobId]
        );
        if (existingApplications.length > 0) {
            return res.status(400).json({ message: 'Already applied for this job' });
        }

        // Create application
        await db.query(
            'INSERT INTO applications (user_id, job_id, status) VALUES (?, ?, ?)',
            [userId, jobId, 'pending']
        );

        // Update statistics
        await db.query(
            'UPDATE student_stats SET applied_jobs = applied_jobs + 1 WHERE user_id = ?',
            [userId]
        );

        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting application' });
    }
});

// Get student dashboard data
router.get('/dashboard', auth, async (req, res) => {
    try {
        const { id: userId } = req.user;

        // Get statistics
        const [stats] = await db.query(
            'SELECT * FROM student_stats WHERE user_id = ?',
            [userId]
        );

        // Get recent applications
        const [applications] = await db.query(`
            SELECT a.*, j.title as job_title, j.company_name 
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE a.user_id = ?
            ORDER BY a.created_at DESC
            LIMIT 5
        `, [userId]);

        // Get recent jobs
        const [recentJobs] = await db.query(`
            SELECT j.* 
            FROM jobs j
            WHERE j.deadline > NOW()
            ORDER BY j.created_at DESC
            LIMIT 5
        `);

        res.json({
            stats: stats[0] || { applied_jobs: 0, shortlisted: 0, interviews: 0 },
            applications,
            recentJobs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

module.exports = router; 