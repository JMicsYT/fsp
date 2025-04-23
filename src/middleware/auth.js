const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');

const authMiddleware = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            req.userId = decoded.userId;
            req.userRole = decoded.role;
            next();
        });
    },

    authorizeRole: (roles) => {
        return (req, res, next) => {
            if (!req.userRole) {
                return res.status(401).json({ message: 'Unauthorized' }); //  Нет роли - не авторизован
            }
            if (!roles.includes(req.userRole)) {
                return res.status(403).json({ message: 'Forbidden' }); //  Роль не соответствует - запрещено
            }
            next();
        };
    },
};

module.exports = authMiddleware;