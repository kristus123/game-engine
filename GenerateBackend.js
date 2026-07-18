import path from "path"
import { AllImports } from "#root/AllImports.js"
const { Files, Imports, Paths } = AllImports

export function GenerateBackend(ENVIRONMENT) {
	if (!ENVIRONMENT) {
		throw new Error("Environment needs to be passed when calling GenerateBackend.")
	}

	Files.deleteFolder(Paths.transpiledBackend)

	// Copy Shared Into transpiledBackend
	const destPath = path.join(Paths.transpiledBackend, "shared") // nabir, stop using path.join. it is ugly

	for (let sharedFilePath of Files.at(Paths.shared)) {
		console.log(sharedFilePath)

		let content = Files.read(sharedFilePath)
		content = content.replaceAll("ENVIRONMENT", `"${ENVIRONMENT}"`)

		const imports = Imports.needed(content, [
			...Files.at(Paths.shared)
		])
			.replaceAll("/shared", "#root/" + destPath)

		Files.write(sharedFilePath.replace(Paths.shared, destPath), imports + "\n" + content)
	}

	for (let f of Files.at("backend/")) {
		const content = Files.read(f)

		const imports = Imports.needed(content, [
			...Files.at("backend/"),
			...Files.at("dev/"),
			...Files.at(Paths.shared),
		])
			.replaceAll("/backend/", "#root/transpiledBackend/")
			.replaceAll("/dev/", "#root/dev/")
			.replaceAll("/shared/", "#root/transpiledBackend/shared/")

		Files.write(f.replace("backend/", "transpiledBackend/"), imports + "\n" + content)
	}
}

import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	throw new Error("stop right there")
	GenerateBackend()
}
