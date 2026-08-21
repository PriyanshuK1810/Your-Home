const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/home", authMiddleware, (req,res) => {
    res.status(200).json({
        message : "User Authenticated Successfully",
        user : req.user
    });
});

module.exports = router;