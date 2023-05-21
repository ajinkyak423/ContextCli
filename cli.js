#! /usr/bin/env node

const { program } = require('commander'); //// how we import the package 
const { openai } = require('./lib/ai');
const { showwcsae } = require('./lib/ai');
const { writeDataToFile } = require('./lib/writeDataToFile');
const readline = require('readline');


program
    .version("1.0.0")
    .description("Gives CLI commands for given context using AI");

program
    .command('prompt <prompt>')
    .alias('p')
    .description('OpenAI response for text context')
    .option('-o, --out <out>', 'Store output in file')
    .option('-s, --showwcsae', 'Post response on Showwcsae')
    .action(async (prompt, ops) => {
        try {
            const res = await openai.completion(prompt);
            const text = res.data.choices[0].text.trim();
            console.log(text);

            if (!!ops.out) {
                writeDataToFile(text, ops.out);
            }

            if (ops.showwcsae) {
                // Prompt the user to confirm posting on Showwcsae
                const readline = require('readline');
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });

                rl.question('Do you want to post this as thread on Showwcsae? (yes/no): ', async (answer) => {
                    if (answer.toLowerCase() === 'yes') {
                        try {
                            const threadData = {
                                title: prompt,
                                message: text,
                            };

                            // Make the API request to post the thread
                            const response = await showwcsae.postThread(threadData);
                        } catch (error) {
                            console.error('Failed to post the thread:', error.response.data);
                        }
                    }

                    rl.close();
                });
            }
        } catch (error) {
            console.log('Error! Something went wrong while calling the API');
            process.exit(1);
        }
    });

program
    .command('user-threads <username>')
    .alias('ut')
    .description('Fetch the top 10 threads for a user')
    .action(async (username) => {
        console.log(username);
        const resp = await showwcsae.getUserThreads(username);
        // console.log(resp)
        console.log();

        const topThreads = resp.slice(0, 10); // Get the top 10 threads

        topThreads.forEach((thread) => {
            console.log('Thread ID:', thread.id);
            console.log('Title:', thread.title);
            console.log('Community:', thread.community ? thread.community.name : 'N/A');
            console.log('Message:', thread.message);

            console.log();
        });
    });

program
    .command('trend <trend>')
    .alias('tr')
    .description('Fetch recommended projects on Showwcase')
    .action(async (trend) => {
        const resp = await showwcsae.getRecommendedProjects(trend);
        console.log('Recommended Projects:');
        console.log();

        resp.forEach((project) => {
            console.log('Project ID:', project.id);
            console.log('Title:', project.title);
            console.log('Summary:', project.projectSummary);
            console.log();
        });

        // Prompt the user for the project ID
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Enter the Project ID to get the draft: ', async (projectId) => {
            try {
                // Get the project draft
                const draft = await showwcsae.getProjectDraft(projectId);

                if (draft.markdown) {
                    console.log('Project Draft:');
                    console.log(draft.markdown);
                } else {
                    console.log('No markdown available for the project.');

                    const project = resp.find((proj) => proj.id === parseInt(projectId));

                    if (project) {
                        const formattedTitle = formatTitleForURL(project.title);
                        const url = `https://www.showwcase.com/show/${projectId}/${formattedTitle}`;
                        console.log('Please visit the project on Showwcsae:');
                        console.log(url);
                    } else {
                        console.log('Invalid project ID.');
                    }
                }
            } catch (error) {
                console.error('Failed to get the project draft:', error.response.data);
            }

            rl.close();
        });
    });

function formatTitleForURL(title) {
    // Replace spaces with dashes and remove any special characters
    return title.replace(/[^a-zA-Z0-9]/g, '-');
}

program
    .command('notification')
    .alias('nf')
    .description('Fetch the notifications')
    .option('-l, --limit <limit>', 'Set the limit for the number of notifications to fetch', 5)
    .action(async (options) => {
        const { limit } = options;

        const resp = await showwcsae.getUserNotifications();
        console.log('Notifications:');
        console.log();

        resp.slice(0, limit).forEach((notification) => {
            console.log('Notification ID:', notification.id);
            console.log('Type:', notification.type);
            console.log('Timestamp:', notification.createdAt);

            if (notification.type === 'new_reply') {
                console.log('Message:', notification.data.reply && notification.data.reply.message);
            }
            console.log();
        });
    });


// magic happens here
// process.argv is native to node and this picks up the arguments after a command
program.parse(process.argv);

