import { Files } from "#root/dev/Files.js"
import { FileConfig } from "#root/FileConfig.js"
import { Markdown } from "#root/dev/Markdown.js"
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

	Transpiler(env, jsFiles)

	PrepareIndexHtml()
}

import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	const env = process.argv[2]
	GenerateFrontend(env)
}
