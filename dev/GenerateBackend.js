import path from "path"
import { Files, Imports, Paths, TranspileContent } from "#root/AllImports.js"

export function GenerateBackend(ENVIRONMENT) {
	if (!ENVIRONMENT) {
		throw new Error("Environment needs to be passed when calling GenerateBackend.")
	}

	Files.deleteFolder(Paths.transpiledBackend)

	// Copy Shared Into transpiledBackend
	const destPath = path.join(Paths.transpiledBackend, "shared") // nabir, stop using path.join. it is ugly

	for (let sharedFilePath of Files.at(Paths.sharedFolder)) {

		let content = Files.read(sharedFilePath)
		content = content.replaceAll("ENV_REPLACED_BY_TRANSPILER", `"${ENVIRONMENT}"`)

		const imports = Imports.needed(content, [
			...Files.at(Paths.sharedFolder)
		])
			.replaceAll("/shared", "/" + destPath)

		Files.write(sharedFilePath.replace(Paths.sharedFolder, destPath), imports + "\n" + content)
	}

	const backendFiles = Files.at("backend/")
	const backendJsFiles = backendFiles.filter(f => f.endsWith(".js"))
	const devJsFiles = Files.at("dev/").filter(f => f.endsWith(".js"))
	const sharedJsFiles = Files.at(Paths.sharedFolder).filter(f => f.endsWith(".js"))
	for (let f of backendFiles) {
		let content = Files.read(f)
		if (f.endsWith(".js")) {
			content = TranspileContent(f, content, backendJsFiles)
		}
		content = content.replaceAll("ENV_REPLACED_BY_TRANSPILER", `"${ENVIRONMENT}"`)

		let imports = f.endsWith(".js") ? Imports.needed(content, [
			...backendJsFiles.filter(candidate => candidate != f),
			...devJsFiles,
			...sharedJsFiles,
		]) : ""
		imports = imports
			.replaceAll("/backend/", "/transpiledBackend/")
			.replaceAll("/dev/", "/dev/")
			.replaceAll("/shared/", "/transpiledBackend/shared/")

		Files.write(f.replace("backend/", "transpiledBackend/"), imports + "\n" + content)
	}
}

import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	GenerateBackend(process.argv[2])
}
