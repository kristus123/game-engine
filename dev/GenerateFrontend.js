import { randomUUID } from "node:crypto"
import { existsSync } from "node:fs"
import { Files, Paths, Transpiler, Markdown, GenerateIndexJs, AssertUniqueFileNames } from "#root/AllImports.js"

// todo find better solution?
// right now everyone creates their own list
export const jsFiles = Files.at(Paths.frontendFolder)
	.filter(f => f.endsWith(".js"))
	.map(f => f.replaceAll("\\", "/")) // is this one needed?

export function GenerateFrontend(env) {
	if (env == null) {
		throw new Error("env cannot be null")
	}
	if (!["DEVELOPMENT", "PRODUCTION"].includes(env)) {
		throw new Error(`unsupported frontend environment: ${env}`)
	}
	AssertUniqueFileNames()

	Files.copyFolder("frontend/", "dist/") // todo use Paths.js
	if (env == "DEVELOPMENT") {
		Files.copyFile("Secrets.js", "dist/Secrets.js")
	}
	else if (existsSync("dist/Secrets.js")) {
		throw new Error("Production output contains dist/Secrets.js; refusing to build with local secrets")
	}

	Transpiler(env, jsFiles)

	const names = Files.at(Paths.frontendFolder)
		.filter(f => f.endsWith(".html") || f.endsWith(".md"))
		.map(f => f.split("/").pop().replace(/\.html$/, "").replace(/\.md$/, ""))

	const seen = new Set()
	for (const name of names) {
		if (seen.has(name)) {
			console.log(name)
			throw new Error(`Duplicate file name found: ${name}`)
		}
		seen.add(name)
	}

	const cssImports = Files.at(Paths.frontendFolder)
		.filter(f => f.endsWith(".css"))
		.map(f => f.replaceAll("\\", "/")) // windows compability
		.map(f => {
			return Files.read(f) + "\n"
			// const p = f.replace("frontend/", "/")
			// return `@import "${p}";`
		})
		.join("\n")
	Files.write(Paths.dist.swag_css, cssImports)

	Files.replace(Paths.dist.serviceWorker_js, "RANDOM_CACHE_ID", randomUUID())

	GenerateIndexJs()
}

import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	const env = process.argv[2]
	GenerateFrontend(env)
}
