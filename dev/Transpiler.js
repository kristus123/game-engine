import { Imports, Files, Paths, TranspileContent } from "#root/AllImports.js"

export function Transpiler(ENVIRONMENT, jsFiles) {
	if (!ENVIRONMENT) {
		throw new Error("you need to include environment when calling Transpiler.js")
	}

	const sharedFiles = Files.at(Paths.sharedFolder)

	for (const jsFilePath of jsFiles) {
		let fileContent = TranspileContent(jsFilePath, Files.read(jsFilePath), jsFiles)

		fileContent = Imports.needed(fileContent, [
			...jsFiles.filter(candidate => candidate != jsFilePath),
			...sharedFiles,
		]) + "\n" + fileContent

		fileContent = fileContent.replaceAll("ENVIRONMENT", `"${ENVIRONMENT}"`)

		Files.writeFileToDist(jsFilePath, fileContent)
	}

	for (let sharedFilePath of sharedFiles) {
		let content = Files.read(sharedFilePath)

		content = content.replaceAll("ENVIRONMENT", `"${ENVIRONMENT}"`)

		const imports = Imports.needed(content, [
			...sharedFiles,
			...jsFiles, // todo remove this. this is a hack
		])

		const p = "dist/" + sharedFilePath // todo improve
		const c = imports + "\n" + content
		Files.write(p, c)
	}

}
