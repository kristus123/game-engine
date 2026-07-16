import path from "path"
import { Files } from "#root/dev/Files.js"
import { Imports } from "#root/dev/Imports.js"
import { FileConfig } from "#root/FileConfig.js"
import { Transpiler } from "#root/dev/Transpiler.js"

export function GenerateBackend(ENVIRONMENT) {
	if (!ENVIRONMENT) {
		throw new Error("Environment needs to be passed when calling GenerateBackend.")
	}

	Files.deleteFolder(FileConfig.transpiledBackend)

	// Copy shared into transpiledBackend
	const sharedFiles = Files.at(FileConfig.shared)
	const destPath = path.join(FileConfig.transpiledBackend, "shared") // nabir, stop using path.join. it is ugly

	for (let sharedFilePath of sharedFiles) {
		console.log(sharedFilePath)

		let content = Files.read(sharedFilePath)
		content = content.replaceAll("ENVIRONMENT", `"${ENVIRONMENT}"`)

		const imports = Imports.needed(content, [
			...sharedFiles
		])
			.replaceAll("/shared", "#root/" + destPath)

		Files.write(sharedFilePath.replace(FileConfig.shared, destPath), imports + "\n" + content)
	}

	// Transpile backend files
	const backendFiles = Files.at("backend/").filter(f => f.endsWith(".js"))

	Transpiler(ENVIRONMENT, backendFiles, [
		...backendFiles,
		...Files.at("dev/"),
		...sharedFiles,
	], (srcPath, content) => {
		content = content
			.replaceAll("/backend/", "#root/transpiledBackend/")
			.replaceAll("/dev/", "#root/dev/")
			.replaceAll("/shared/", "#root/transpiledBackend/shared/")

		Files.write(srcPath.replace("backend/", "transpiledBackend/"), content)
	})
}

import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	throw new Error("stop right there")
	GenerateBackend()
}
