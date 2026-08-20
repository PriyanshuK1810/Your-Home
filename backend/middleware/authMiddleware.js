const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;

        //Check if Authorization Header Exists
        if (!authHeader) {
            return res.status(401).json({
                message : "Authorization Token Required"
            });
        }

        //Check Bearer Format
        if(!authHeader.startswith("Bearer ")) {
            return res.status(401).json({
                message : "Invalid Authorization Format"
            });
        }

        //Extract and Verify The token
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_Secret
        );

        req.user = decoded;
        next();
    }
    catch(error) {
        return res.status(401).json({
            message : "Invalid Or Expired Token"
        });
    }
};

module.exports = authMiddleware;