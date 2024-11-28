import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied, token missing!' });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing!' });
    }

    try {
        const decoded = jwt.verify(token, "fitness_tracker"); 
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token', error: error.message });
    }
};

// export const authorizeRoles = (...allowedRoles) => {
//     return (req, res, next) => {
//         const userRole = req.user.role; 

//         if (!allowedRoles.includes(userRole)) {
//             return res.status(403).json({ msg: "access denied" });
//         }

//         next(); 
//     };
// };