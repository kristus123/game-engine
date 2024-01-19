const fs = require('fs');
const path = require('path');

const jsFiles = [];

function getJsFiles(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            getJsFiles(filePath);
        } else if (file.endsWith('.js')) {
            jsFiles.push(filePath);
        }
    }
}

getJsFiles('static');
const sortedJsFiles = jsFiles.sort();

console.log(sortedJsFiles);

