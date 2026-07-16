import { Files } from "#root/dev/Files.js"
import { FileConfig } from "#root/FileConfig.js"
import { Imports } from "#root/dev/Imports.js"
import { Transpiler } from "#root/dev/Transpiler.js"
import { PrepareIndexHtml } from "#root/dev/PrepareIndexHtml.js"

// todo find better solution?
// right now everyone creates their own list
export const jsFiles = Files.at(FileConfig.frontend)
	.filter(f => f.endsWith(".js"))
	.map(f => f.replaceAll("\\", "/")) // is this one needed?

export function GenerateFrontend(env) {
	if (env == null) {
		throw new Error("env cannot be null")
	}

	Files.copyFolder("frontend/", "dist/") // todo use FileConfig.js

	const sharedFiles = Files.at(FileConfig.shared)

	Transpiler(env, jsFiles, [...jsFiles, ...sharedFiles], Files.writeFileToDist)

	for (let sharedFilePath of sharedFiles) {
		let content = Files.read(sharedFilePath)
		content = content.replaceAll("ENVIRONMENT", `"${env}"`)

		const imports = Imports.needed(content, [
			...sharedFiles,
			...jsFiles, // todo remove this. this is a hack
		])

		const p = "dist/" + sharedFilePath // todo improve
		const c = imports + "\n" + content
		Files.write(p, c)
	}

	PrepareIndexHtml()
}

import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	const env = process.argv[2]
	GenerateFrontend(env)
}
