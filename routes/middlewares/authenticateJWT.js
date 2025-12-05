const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: "Authorization header missing" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, email: decoded.email }; 
        next();
    } catch (err) {
        return res.status(403).send({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateJWT;
