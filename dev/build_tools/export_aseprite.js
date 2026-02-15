import fs from 'fs'
import path from 'path'
import { Aseprite } from './Aseprite.js'
import { FileConfig } from '#root/FileConfig.js'

function walk(relDir, callback) {
	const entries = fs.readdirSync(relDir, { withFileTypes: true })

	for (const entry of entries) {
		const relPath = path.join(relDir, entry.name)

		if (entry.isDirectory()) {
			walk(relPath, callback)
		}
		else if (entry.isFile() && relPath.endsWith('.aseprite')) {
			callback(relPath)
		}
	}
}

function exportAseprite(relSrcFile, destBase) {

	if (!fs.existsSync(path.dirname(destBase))) {
		fs.mkdirSync(path.dirname(destBase), { recursive: true })
	}

	destBase = destBase.replaceAll('.aseprite', '')

	Aseprite.tags(relSrcFile, destBase)
	Aseprite.groups(relSrcFile, destBase)
	Aseprite.layers(relSrcFile, destBase)
	Aseprite.tilemaps(relSrcFile)
}

const editedFile = process.argv[2] || false

const exportFile = (file) => {
	exportAseprite(file, path.join(FileConfig.dist, `${file}`))
}

if (editedFile) {
	exportFile(editedFile)
}
else {
	walk(FileConfig.asepriteAssets, exportFile)
}
