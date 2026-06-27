import fs from "fs"
import Path from "path"
import { Aseprite } from "#root/dev/aseprite/Aseprite.js"
import { FileConfig } from "#root/FileConfig.js"
import { Files } from "#root/dev/Files.js"

function exportAseprite(relSrcFile, destBase) {

	if (!fs.existsSync(Path.dirname(destBase))) {
		fs.mkdirSync(Path.dirname(destBase), { recursive: true })
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
		const files = Files.at(FileConfig.asepriteAssets)
			.filter(f => f.endsWith(".aseprite"))

		for (const f of files) {
			exportFile(f)
		}
	}
}
