#! /usr/bin/env node

const { program } = require('commander'); //// how we import the package 
const { openai } = require('./lib/ai');
const { writeDataToFile } = require('./lib/writeDataToFile');
/// commander package is stored in variable program

// async function main(ai, input) {
//     const res = await ai.completion(input);
//     console.log(res.data.choices[0].text);
// }

program
    .version("1.0.0")
    .description("Gives CLI commands for given context using AI");

program
    .command('prompt <prompt>')  //// name the command (here "example") and give arguments is <inputs> format
    .alias("p")
    .option("-o, --out <out>", "Store output in file")
    .description("OpenAI response for text context")
    .action(async (prompt, ops) => {
        try {
            const res = await openai.completion(prompt);
            const text = res.data.choices[0].text.trim();
            console.log(text);

            if (!!ops.out) {
                writeDataToFile(text, ops.out)
            }
            // console.log({ ops });
        } catch (error) {
            console.log("error!!  something went wrong while calling the API");
            process.exit(1);
        }
    });

// magic happens here
// process.argv is native to node and this picks up the arguments after a command
program.parse(process.argv);

