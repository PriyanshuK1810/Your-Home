const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next) => {
    try{
        let token = null;
        const authHeader = req.headers.authorization;

        //Check if Authorization Header Exists
        if(
            authHeader &&
            typeof authHeader === "string" && 
            authHeader.startsWith("Bearer ")
        )
        {
            token = authHeader.split(" ")[1];
        };

        if(!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        };

        if (!token) {
            return res.status(401).json({
                message : "Authorization Token Required"
            });
        };

        const decoded = jwt.verify(
            token,
            process.env.JWT_Secret
        );

        req.user = decoded;
        next();
    }
    catch(error) {
        return res.status(401).json({
            message : "Invalid Or Expired Token",
        });
    }
};

module.exports = authMiddleware;