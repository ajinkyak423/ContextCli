require("dotenv").config({ path: __dirname + "/.env" });

const config = {
    apiToken: process.env.API_TOKEN,
    showwToken: process.env.SHOWW_TOKEN
};

module.exports = { config };