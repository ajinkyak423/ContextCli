const fs = require("fs")

const writeDataToFile = (data, fileName) => {
    fs.writeFileSync(fileName, data);
};

module.exports = { writeDataToFile }