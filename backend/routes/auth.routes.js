const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        // If user is a student, initialize their statistics
        if (role === 'student') {
            await db.query(
                'INSERT INTO student_stats (user_id) VALUES (?)',
                [result.insertId]
            );
        }

        // Generate token
        const token = jwt.sign(
            { id: result.insertId, role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                name,
                email,
                role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Delete account
router.delete('/delete-account', auth, async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Verify password
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Begin transaction to delete user and related data
        await db.query('START TRANSACTION');

        try {
            // Delete based on user role
            if (userRole === 'student') {
                // Delete student applications
                await db.query('DELETE FROM applications WHERE user_id = ?', [userId]);
                
                // Delete student statistics
                await db.query('DELETE FROM student_stats WHERE user_id = ?', [userId]);
            } else if (userRole === 'company') {
                // Get company profile ID
                const [profiles] = await db.query('SELECT id FROM company_profiles WHERE user_id = ?', [userId]);
                
                if (profiles.length > 0) {
                    const companyId = profiles[0].id;
                    
                    // Delete applications for jobs posted by this company
                    await db.query('DELETE FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = ?)', [companyId]);
                    
                    // Delete jobs
                    await db.query('DELETE FROM jobs WHERE company_id = ?', [companyId]);
                    
                    // Delete company profile
                    await db.query('DELETE FROM company_profiles WHERE id = ?', [companyId]);
                }
            } else if (userRole === 'faculty') {
                // Delete faculty-specific data if applicable
                // Example: await db.query('DELETE FROM faculty_data WHERE user_id = ?', [userId]);
            }

            // Finally, delete the user
            await db.query('DELETE FROM users WHERE id = ?', [userId]);
            
            // Commit the transaction
            await db.query('COMMIT');
            
            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            // Rollback in case of error
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Error deleting account' });
    }
});

module.exports = router; 