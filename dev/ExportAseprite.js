
import fs from "fs"
import path from "path"
import { Aseprite } from "#root/dev/Aseprite.js"
import { FileConfig } from "#root/FileConfig.js"

function walk(relDir, callback) {
	const entries = fs.readdirSync(relDir, { withFileTypes: true })

	for (const entry of entries) {
		const relPath = path.join(relDir, entry.name)

		if (entry.isDirectory()) {
			walk(relPath, callback)
		}
		else if (entry.isFile() && relPath.endsWith(".aseprite")) {
			callback(relPath)
		}
	}
}

function exportAseprite(relSrcFile, destBase) {

	if (!fs.existsSync(path.dirname(destBase))) {
		fs.mkdirSync(path.dirname(destBase), { recursive: true })
	}

	destBase = destBase.replaceAll(".aseprite", "")

	Aseprite.tags(relSrcFile, destBase)
	Aseprite.groups(relSrcFile, destBase)
	Aseprite.layers(relSrcFile, destBase)
	Aseprite.tilemaps(relSrcFile)
}

export function ExportAseprite(path = null) {
	const exportFile = (file) => {
		exportAseprite(file, FileConfig.toDistPath(`${file}`))
	}

	if (path) {
		exportFile(path)
	}
	else {
		walk(FileConfig.asepriteAssets, exportFile)
	}
}