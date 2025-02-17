// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports.auth = (context) => {
    if (!context.req || !context.req.headers) {
        throw new Error("Request headers are missing in GraphQL context");
    }

    const authHeader = context.req.headers.authorization;
    if (!authHeader) {
        throw new Error("Authorization header is missing");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new Error("Token is missing");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        context.user = decoded; // Attach decoded user info to context
    } catch (err) {
        throw new Error("Invalid/Expired token");
    }
};
