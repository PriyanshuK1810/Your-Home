const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async(plainPassword) => {
    return await bcrypt.hash(plainPassword, 12);
};

const comparePassword = async(plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

const generateToken = (user) => {
    return jwt.sign(
        {
            id : user.id,
            email : user.email
        },
        process.env.JWT_Secret,
        {
            expiresIn : "1h"
        }
    );
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken
};


