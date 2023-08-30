// all the api calls are here to ai
const axios = require("axios");
const { config } = require("../config")
// const TOKEN = "";
const openai = {
    completion: (prompt) => {
        // call ai api
        const opts = {
            url: "https://api.openai.com/v1/completions",
            method: "post",
            data: {
                model: "text-davinci-003",
                prompt,
                max_tokens: 500,
                temperature: 0.7,
                n: 1,
                stream: false,
            },
            headers: {
                Authorization: `Bearer ${config.apiToken}`
            },
        };
        // return the response 
        console.log("generating...")
        return axios.request(opts);
    },
};


const showwcsae = {
    postThread: (threadData) => {
        const opts = {
            url: 'https://cache.showwcase.com/threads',
            method: 'post',
            data: {
                title: threadData.title,
                message: threadData.message,
            },
            headers: {
                'X-API-KEY': `${config.showwToken}`,
                'Authorization': `Bearer ${config.showwToken}`,
            },
        };

        console.log('Posting thread...');

        return axios.request(opts)
            .then(response => {
                console.log('Thread posted successfully!');
                console.log('Thread ID:', response.data.id);
                return response.data;
            })
            .catch(error => {
                console.error('Failed to post the thread:', error.response.data);
                throw error;
            });
    },

    getUserThreads: (username) => {
        const opts = {
            url: `https://cache.showwcase.com/threads?username=${encodeURIComponent(username)}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.showwToken}`,
            },
        };
        console.log(`Fetching threads for user: ${username}`);

        return axios
            .request(opts)
            .then((response) => {
                console.log('Threads fetched successfully!');
                return response.data;
            })
            .catch((error) => {
                console.error('Failed to fetch threads:', error.response.data);
                throw error;
            });
    },

    getRecommendedProjects: (limit = 5) => {
        const url = `https://cache.showwcase.com/projects/recommended?limit=${limit}`;

        const opts = {
            url,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.showwToken}`,
            },
        };

        console.log(`Fetching recommended projects...`);

        return axios
            .request(opts)
            .then((response) => {
                console.log('Recommended projects fetched successfully!');
                return response.data;
            })
            .catch((error) => {
                console.error('Failed to fetch recommended projects:', error.response.data);
                throw error;
            });
    },

    getProjectDraft: (projectId) => {
        const url = `https://cache.showwcase.com/projects/${encodeURIComponent(projectId)}/draft?projectId=${projectId}`;

        const opts = {
            url,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.showwToken}`,
                'X-API-KEY': `${config.showwToken}`,
            },
        };

        console.log(`Fetching draft for project ID: ${projectId}`);
        return axios
            .request(opts)
            .then((response) => {
                console.log('Draft fetched successfully!');
                return response.data;
            })
            .catch((error) => {
                console.error('Failed to fetch draft:', error.response.data);
                throw error;
            });
    },

    getUserNotifications: (limit) => {
        const opts = {
            url: `https://cache.showwcase.com/notifications?limit=${limit}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.showwToken}`,
                'X-API-KEY': `${config.showwToken}`,
            },
        };
        console.log("Fetching notifications...");
        return axios
            .request(opts)
            .then((response) => {
                console.log('Notifications fetched successfully!');
                return response.data;
            })
            .catch((error) => {
                console.error('Failed to fetch notification:', error.response.data);
                throw error;
            });
    }

};

module.exports = { openai, showwcsae };

