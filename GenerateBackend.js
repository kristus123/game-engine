import { Files } from "#root/dev/Files.js"
import { Imports } from "#root/dev/Imports.js"

export function GenerateBackend() {
	Files.deleteFolder(FileConfig.transpiledBackend)

	for (let f of Files.at("backend/")) {
		console.log(f)

		const content = Files.read(f)

		const imports = Imports.needed(content, [
			...Files.at("backend/"),
			...Files.at("dev/"),
			...Files.at(FileConfig.shared)
		])
			.replaceAll("/backend/", "#root/transpiledBackend/")
			.replaceAll("/dev/", "#root/dev/")
			.replaceAll("/shared/", "#root/shared/")

		Files.write(f.replace("backend/", "transpiledBackend/"), imports + "\n" + content)
	}
}

import { fileURLToPath } from "url"
import { FileConfig } from "#root/FileConfig.js"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	GenerateBackend()
}
