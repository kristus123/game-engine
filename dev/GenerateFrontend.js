import { AllImports } from "#root/AllImports.js"
const {
	Files,
	Paths,
	Transpiler,
	Markdown,
	GenerateIndexJs,
} = AllImports

// todo find better solution?
// right now everyone creates their own list
export const jsFiles = Files.at(Paths.frontendFolder)
	.filter(f => f.endsWith(".js"))
	.map(f => f.replaceAll("\\", "/")) // is this one needed?

export function GenerateFrontend(env) {
	if (env == null) {
		throw new Error("env cannot be null")
	}

	Files.copyFolder("frontend/", "dist/") // todo use Paths.js

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


	GenerateIndexJs()
}

import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	const env = process.argv[2]
	GenerateFrontend(env)
}
