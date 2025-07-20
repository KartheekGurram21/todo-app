//  start writing from here
const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    try { 
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if(decoded) {
                req.userId = decoded.userId;
                next();
            } else {
                res.status(400).json({
                    message: "not signed in"
                });
            }
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = userAuth;