const fs = require('fs');
const path = require('path');

module.exports = class Files {

  static inFolder(path) {

    return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const filesAndFolders = {};

          files.forEach(file => {
            const stat = fs.statSync(path.join(path, file));
            if (stat.isDirectory()) {
              filesAndFolders[file] = [];
            } else {
              const folderName = path.dirname(file);
              if (!filesAndFolders[folderName]) {
                filesAndFolders[folderName] = [];
              }
              filesAndFolders[folderName].push(path.basename(file));
            }
          });

          resolve(filesAndFolders);
        }
      });
    });
  }
}

