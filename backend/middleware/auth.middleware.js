const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided!' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized!' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Require Admin Role!' });
    }
    next();
};

const isFaculty = (req, res, next) => {
    if (req.userRole !== 'faculty' && req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Require Faculty Role!' });
    }
    next();
};

const isCompany = (req, res, next) => {
    if (req.userRole !== 'company' && req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Require Company Role!' });
    }
    next();
};

module.exports = {
    verifyToken,
    isAdmin,
    isFaculty,
    isCompany
}; 