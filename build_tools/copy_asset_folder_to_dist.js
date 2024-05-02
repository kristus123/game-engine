const fs = require('fs')
const path = require('path')


// Function to recursively copy a folder
function copyFolderRecursive(source, destination) {
	if (!fs.existsSync(source)) {
		console.error('Source folder does not exist.')
		process.exit(1)
	}

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


copyFolderRecursive('static/assets/', 'dist/static/assets/')
copyFolderRecursive('static/audio/', 'dist/static/audio/')
copyFolderRecursive('static/gui/', 'dist/static/gui/')
