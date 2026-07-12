import path from "path"
import { Files } from "#root/dev/Files.js"
import { Imports } from "#root/dev/Imports.js"

export function GenerateBackend(ENVIRONMENT) {
	if (!ENVIRONMENT) {
		throw new Error("Environment needs to be passed when calling GenerateBacked.")
	}

	Files.deleteFolder(FileConfig.transpiledBackend)

	// Copy Shared Into transpiledBackend
	const destPath = path.join(FileConfig.transpiledBackend, "shared") // nabir, stop using path.join. it is ugly

	for (let sharedFilePath of Files.at(FileConfig.shared)) {
		console.log(sharedFilePath)

		let content = Files.read(sharedFilePath)
		content = content.replaceAll("ENVIRONMENT", `"${ENVIRONMENT}"`)

		const imports = Imports.needed(content, [
			...Files.at(FileConfig.shared)
		])
			.replaceAll("/shared", "#root/" + destPath)

		Files.write(sharedFilePath.replace(FileConfig.shared, destPath), imports + "\n" + content)
	}

	for (let f of Files.at("backend/")) {
		const content = Files.read(f)

		const imports = Imports.needed(content, [
			...Files.at("backend/"),
			...Files.at("dev/"),
			...Files.at(FileConfig.shared),
		])
			.replaceAll("/backend/", "#root/transpiledBackend/")
			.replaceAll("/dev/", "#root/dev/")
			.replaceAll("/shared/", "#root/transpiledBackend/shared/")

		Files.write(f.replace("backend/", "transpiledBackend/"), imports + "\n" + content)
	}
}

import { fileURLToPath } from "url"
import { FileConfig } from "#root/FileConfig.js"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	throw new Error("stop right there")
	GenerateBackend()
}
