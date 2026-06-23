import { Files } from "#root/dev/Files.js"
import { Imports } from "#root/dev/Imports.js"

export function GenerateBackend() {
	Files.deleteFolder("transpiledBackend")

	for (let f of Files.at("backend/")) {
		console.log(f)

		const content = Files.read(f)

		const imports = Imports.needed(content, [
			...Files.at("backend/"),
			...Files.at("dev/"),
		])
			.replaceAll("/backend/", "#root/transpiledBackend/")
			.replaceAll("/dev/", "#root/dev/")

		Files.write(f.replace("backend/", "transpiledBackend/"), imports + "\n" + content)
	}

}

import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	GenerateBackend()
}
