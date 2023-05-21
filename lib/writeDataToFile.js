const fs = require("fs")

const writeDataToFile = (data, fileName) => {
    fs.appendFileSync(fileName, `${data}\n\n`);
    console.log(`Data written to file: ${fileName}`);
};

module.exports = { writeDataToFile }