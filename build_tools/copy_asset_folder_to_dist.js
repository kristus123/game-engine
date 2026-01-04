import fs from 'fs'
import path from 'path'

function copyFolderRecursive(source, destination) {
	if (!fs.existsSync(destination)) {
		fs.mkdirSync(destination, { recursive: true })
	}

	const files = fs.readdirSync(source)

	for (const file of files) {
		const srcPath = path.join(source, file)
		const destPath = path.join(destination, file)

		if (fs.statSync(srcPath).isDirectory()) {
			copyFolderRecursive(srcPath, destPath)
		}
		else {
			fs.copyFileSync(srcPath, destPath)
		}
	}
}

copyFolderRecursive('game/assets', 'dist/game/assets')
copyFolderRecursive('game/audio', 'dist/game/audio')
fs.copyFileSync('sw-push.js', 'dist/sw-push.js')
