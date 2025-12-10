const fs = require('fs')
const path = require('path')


class Files {
	static inFolder(directoryPath) {
		const files = fs.readdirSync(directoryPath)
		const filesAndFolders = {}

		files.forEach(file => {
			const stat = fs.statSync(path.join(directoryPath, file))
			if (stat.isDirectory()) {
				filesAndFolders[file] = fs.readdirSync(path.join(directoryPath, file)).map(img => {
					return path.join(directoryPath, file, img)
				})
			}
			else {
				const folderName = path.dirname(file)
				if (!filesAndFolders[folderName]) {
					filesAndFolders[folderName] = []
				}
				filesAndFolders[folderName].push(path.basename(file))
			}
		})

		return filesAndFolders
	}
}

module.exports = Files
