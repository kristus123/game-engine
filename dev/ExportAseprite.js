// move this into dev/asserts/

import fs from "fs"
import Path from "path"
import { Aseprite, Paths, Files } from "#root/AllImports.js"

async function exportAseprite(relSrcFile, destBase) {
	const dir = Path.dirname(destBase)

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}

	destBase = destBase.replaceAll(".aseprite", "")

	await Promise.all([
		Aseprite.tags(relSrcFile, destBase),
		Aseprite.groups(relSrcFile, destBase),
		Aseprite.layers(relSrcFile, destBase),
		Aseprite.tilemaps(relSrcFile),
	])
}

export async function ExportAseprite(path = null) {
	const exportFile = async (file) => {
		const name = Path.basename(file, ".aseprite")
		const destBase = `dist/generatedAseprite/${name}/${name}`
		await exportAseprite(file, destBase)
	}

	if (path) {
		await exportFile(path)
		return
	}

	const files = Files.at(Paths.frontendFolder)
		.filter(f => f.endsWith(".aseprite"))

	await Promise.all(files.map(f => exportFile(f)))
}
