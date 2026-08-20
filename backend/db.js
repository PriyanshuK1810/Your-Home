require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    ssl : {
        rejectUnauthorized : false
    }
});

pool.on("connect", () => {
    console.log("Connected To CockroachDB");
});

pool.on("error", (err) => {
    console.log("CockroachDB Connection Error: ",err);
});

module.exports = pool;
