// all the api calls are here to ai
const axios = require("axios");
const { config } = require("../config")
// const API_TOKEN = ;
const openai = {
    completion: (prompt) => {
        // call ai api
        const opts = {
            url: "https://api.openai.com/v1/completions",
            method: "post",
            data: {
                model: "text-davinci-003",
                prompt,
                max_tokens: 250,
                temperature: 0.7,
                n: 1,
                stream: false,
            },
            headers: {
                Authorization: `Bearer ${config.apiToken}`,
            },
        };
        // return the response 
        console.log("generating...")
        return axios.request(opts);
    },
};

module.exports = { openai }

