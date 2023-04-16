require("dotenv").config({ path: __dirname + "/.env" });

const config = {
    apiToken: process.env.API_TOKEN,
};

module.exports = { config };