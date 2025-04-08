const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken, isCompany } = require('../middleware/auth.middleware');

// Create company profile
router.post('/profile', verifyToken, isCompany, async (req, res) => {
    try {
        const { company_name, industry, website, description } = req.body;
        
        // Check if profile already exists
        const [existing] = await db.query(
            'SELECT * FROM company_profiles WHERE user_id = ?',
            [req.userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Company profile already exists' });
        }

        // Create profile
        const [result] = await db.query(
            `INSERT INTO company_profiles (
                user_id, company_name, industry, website, description
            ) VALUES (?, ?, ?, ?, ?)`,
            [req.userId, company_name, industry, website, description]
        );

        res.status(201).json({
            message: 'Company profile created successfully',
            profileId: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating company profile' });
    }
});

// Get company profile
router.get('/profile', verifyToken, isCompany, async (req, res) => {
    try {
        const [profiles] = await db.query(
            'SELECT * FROM company_profiles WHERE user_id = ?',
            [req.userId]
        );

        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        res.json(profiles[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching company profile' });
    }
});

module.exports = router; 