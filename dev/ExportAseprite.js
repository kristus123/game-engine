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
		const cacheDir = Path.join(Paths.asepriteCacheFolder, name)
		const distDir = Path.join(Paths.distFolder, "generatedAseprite", name)
		const cacheBase = Path.join(cacheDir, name)
		const sourceModified = fs.statSync(file).mtimeMs
		const cachedFiles = [
			`${cacheBase}.png`,
			`${cacheBase}.json`,
			`${cacheBase}Groups.json`,
			`${cacheBase}Layers.png`,
			`${cacheBase}Layers.json`,
			`${cacheBase}Tilemaps.json`,
		]
		const missingFiles = cachedFiles.filter(cachedFile => !fs.existsSync(cachedFile))
		const outdatedFiles = cachedFiles.filter(cachedFile =>
			fs.existsSync(cachedFile) && fs.statSync(cachedFile).mtimeMs < sourceModified
		)
		const cacheIsFresh = missingFiles.length == 0 && outdatedFiles.length == 0

		if (cacheIsFresh) {
			console.log(`[Aseprite] cache hit: ${file}`)
		}
		else {
			const reasons = []
			if (missingFiles.length > 0) {
				reasons.push(`${missingFiles.length} output(s) missing`)
			}
			if (outdatedFiles.length > 0) {
				reasons.push(`${outdatedFiles.length} output(s) older than source`)
			}
			console.log(`[Aseprite] generating: ${file} (${reasons.join(", ")})`)
			await exportAseprite(file, cacheBase)
		}

		for (const cachedFile of cachedFiles) {
			if (!fs.existsSync(cachedFile)) {
				throw new Error(`Aseprite export did not create expected file: ${cachedFile}`)
			}
		}

		fs.mkdirSync(distDir, { recursive: true })
		for (const cachedFile of cachedFiles) {
			fs.copyFileSync(cachedFile, Path.join(distDir, Path.basename(cachedFile)))
		}
	}

	if (path) {
		console.log(`[Aseprite] checking changed sprite only: ${path}`)
		await exportFile(path)
	}
	else {
		const files = Files.at(Paths.frontendFolder)
			.filter(f => f.endsWith(".aseprite"))

		console.log(`[Aseprite] checking cache for ${files.length} sprites`)
		await Promise.all(files.map(f => exportFile(f)))
	}

}
