const express = require("express");
const db = require("../db")
const { 
    hashPassword,
    comparePassword,
    generateToken
 } = require("../utils/auth");
const e = require("express");

const router = express.Router()

router.post("/register", async (req,res) => {
    try{
        const { name, email, password, username } = req.body;
        if(!name || !username || !email || !password){
            return res.status(400).json({
                message : "Name, Email, Username and Passwoed are required"
            });
        }

        if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
            return res.status(400).json({
                message : "Invalid Username"
            });
        }

        const hashedPassword = await hashPassword(password)

        const statement = db.prepare(`
            Insert into users (name, email, username, password)
            values (?, ?, ?, ?)
            `);
        const result = statement.run(name, email, username, hashedPassword)

        return res.status(201).json({
            message : "User Registered Successfully",
            userId : result.lastInsertRowid
        });
    }
    catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE'){
            return res.status(409).json({
                message : "Email already registered"
            });
        };
        console.error(error);
        return res.status(500).json({
            message : "Interval server error"
        })
    }
});

router.post("/login", async (req,res) => {
    try{
        const { email, password } = req.body;
        
        //Basic Validation
        if ( !email || !password ) {
            return res.status(400).json({
                message : "Email and Password are Required"
            });
        }

        //Finding User By Email
        const user = db.prepare(
            "SELECT * FROM users WHERE email = ?"
        ).get(email);

        //Check whether email or password is incorrect
        if (!user) {
            return res.status(401).json({
                message : "Invalid Credentials"
            });
        }

        //Compare Password using stored bcrypt hash
        const passwordMatches = await comparePassword(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message : "Incorrect Username or Password"
            });
        }

        //Generate JWT Token
        const token = generateToken(user);

        //Send Token And User Information
        return res.status(200).json({
            message : "Login Successful!",
            token,
            user :{
                id : user.id,
                name : user.name,
                username : user.username,
                email : user.email
            }
        });
    }
    catch(error) {
        console.error("Login Error: ", error);
        return res.status(500).json({
            message : "Internal Server Error"
        });
    }
});

module.exports = router


