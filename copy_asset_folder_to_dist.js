
const fs = require('fs')
const path = require('path')

const sourceFolder = 'static/assets/'
const destinationFolder = 'dist/static/assets/'

// Function to recursively copy a folder
function copyFolderRecursive(source, destination) {
	if (!fs.existsSync(destination)) {
		fs.mkdirSync(destination)
	}

	const files = fs.readdirSync(source)

	files.forEach((file) => {
		const sourcePath = path.join(source, file)
		const destinationPath = path.join(destination, file)

		if (fs.statSync(sourcePath).isDirectory()) {
			copyFolderRecursive(sourcePath, destinationPath)
		}
		else {
			fs.copyFileSync(sourcePath, destinationPath)
		}
	})
}

// Ensure the source folder exists
if (!fs.existsSync(sourceFolder)) {
	console.error('Source folder does not exist.')
	process.exit(1)
}

// Copy the folder recursively
copyFolderRecursive(sourceFolder, destinationFolder)

console.log('Folder copied successfully!')

