import fs from 'fs'
import path from 'path'
import { Aseprite } from './Aseprite.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SRC_DIR = path.join(__dirname, '../game/assets/aseprite')
const DEST_BASE = path.join(__dirname, '../dist/game/assets')

function walk(dir, callback) {
	fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			walk(fullPath, callback)
		}
		else if (entry.isFile() && fullPath.endsWith('.aseprite')) {
			callback(fullPath)
		}
	})
}

function getRelativeDestPath(srcFile) {
	const relPath = path.relative(SRC_DIR, srcFile)
	const parsed = path.parse(relPath)
	const destFolder = path.join(DEST_BASE, parsed.dir.replace(/aseprite[\/\\]?/, ''))
	return path.join(destFolder, parsed.name)
}

function exportAseprite(srcFile, destBase) {

	const destDir = path.dirname(destBase)
	if (!fs.existsSync(destDir)) {
		fs.mkdirSync(destDir, { recursive: true })
	}

	Aseprite.tags(srcFile, destBase)
	Aseprite.groups(srcFile, destBase)
	Aseprite.layers(srcFile, destBase)
	Aseprite.tilemaps(srcFile, destBase)
	console.log("finished exporting aseprite")
}

const editedFile = process.argv[2] || false
if (editedFile) {
	const destBase = getRelativeDestPath(editedFile)
	exportAseprite(editedFile, destBase)

}
else {
	walk(SRC_DIR, srcFile => {
		const destBase = getRelativeDestPath(srcFile)
		exportAseprite(srcFile, destBase)
	})
}
