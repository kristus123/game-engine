import fs from 'fs'
import path from 'path'

function copyFolder(source, destination) {
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
			copyFolder(sourcePath, destinationPath)
		}
		else {
			fs.copyFileSync(sourcePath, destinationPath)
		}
	})
}


copyFolder('game/assets/', 'dist/game/assets/')
copyFolder('game/audio/', 'dist/game/audio/')
copyFolder('game/ui/', 'dist/game/ui/')
