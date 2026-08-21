const express = require("express");
const db = require("../db")
const {
    hashPassword,
    comparePassword,
    generateToken
} = require("../utils/auth");
const { Result } = require("pg");

const router = express.Router()

//Register

router.post("/register", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        //Check Required fields for null value
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                message: "All Fields are required"
            });
        }

        //Validate Username
        const usernameRegex = /^[a-zA-Z0-9_.]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                message: "Invalid Username"
            });
        }

        //Check for existing email
        const existingemail = await db.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingemail.rows.length > 0) {
            return res.status(409).json({
                message: "Email Already Registered"
            });
        }

        //Check if username exists
        const existingusername = await db.query(
            "SELECT id FROM users WHERE username = $1",
            [username]
        );

        if (existingusername.rows.length > 0) {
            return res.status(409).json({
                message: "Username Already Exists"
            });
        }

        //Hash Password
        const hashedPassword = await hashPassword(password)

        //Insert User Details in DB
        const statement = db.query(`
            INSERT INTO users (name, username, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
            [
                name,
                username,
                email,
                hashedPassword
            ]
        );

        return res.status(201).json({
            message: "User Registered Successfully",
        });
    }
    catch (error) {
        console.error("Register Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

//Login

router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        //Basic Validation
        if (!identifier || !password) {
            return res.status(400).json({
                message: "Email/Username and Password are Required"
            });
        }

        //Finding User By Email Or Username
        const result = await db.query(
            `SELECT * FROM users
            WHERE email = $1 OR username = $1
            LIMIT 1`,
            [identifier]
        );

        const user = result.rows[0];

        //User Not Found Error
        if (!user) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }


        //Compare Password using stored bcrypt hash
        const passwordMatches = await comparePassword(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Incorrect Username or Password"
            });
        }

        //Generate JWT Token
        const token = generateToken(user);

        //Store JWT in an HttpOnly Cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 60 * 60 * 1000,
            path: "/"
        });

        //Send Token And User Information
        return res.status(200).json({
            message: "Login Successful!",
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error("Login Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

module.exports = router


