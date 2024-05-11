const fs = require('fs')
const path = require('path')

// module.exports =

class Files {
	static inFolder(directoryPath) {
		const filesAndImages = {}
		this.processDirectory(directoryPath, filesAndImages)
		filesAndImages.path = directoryPath
		return filesAndImages
	}

	static processDirectory(directoryPath, filesAndImages) {
		const items = fs.readdirSync(directoryPath)
		if (items.length > 0) {
			items.forEach((item) => {
				const itemPath = path.join(directoryPath, item)
				const itemName = path.basename(itemPath)

				if (fs.statSync(itemPath).isDirectory()) {
					const subFilesAndImages = {}
					this.processDirectory(itemPath, subFilesAndImages)
					filesAndImages[itemName] = subFilesAndImages
				}
				else {
					if (filesAndImages.root) {
						filesAndImages.root.push(itemName)
					}
					else {
						filesAndImages.root = [itemName]
					}
				}
			})
		}
	}
}

module.exports = Files
