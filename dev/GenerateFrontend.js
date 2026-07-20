import { AllImports } from "#root/AllImports.js"
const { Files, Paths, Transpiler, Markdown, GenerateIndexJs } = AllImports

// todo find better solution?
// right now everyone creates their own list
export const jsFiles = Files.at(Paths.frontend)
	.filter(f => f.endsWith(".js"))
	.map(f => f.replaceAll("\\", "/")) // is this one needed?

function PrepareIndexHtml() {
	const htmlContents = Files.at(Paths.client) // rename to htmlTemplates
		.filter(f => !f.includes("index.html"))
		.filter(f => f.endsWith(".html") || f.endsWith(".md"))
		.map(f => {
			let content = Files.read(f)

			if (f.endsWith(".md")) {
				content = Markdown.toHtml(content)
			}

			content = content
				.replace("\n", "")
				.replace(/\s+/g, " ")
				.trim()

			const name = f.split("/").pop()
				.replace(/\.html$/, "")
				.replace(/\.md$/, "")

			return JSON.stringify({ name: name, content: content })
		})

	const cssImports = Files.at(Paths.cssFolder)
		.map(f => f.replaceAll("\\", "/")) // windows compability
		.map(f => Files.read(f))
		.join("\n")

	const indexHtml = Files.read(Paths.index_html)
		.replace("CSS_IMPORTS", cssImports)

	Files.write(Paths.toDistPath(Paths.index_html), indexHtml)

	return htmlContents
}

export function GenerateFrontend(env) {
	if (env == null) {
		throw new Error("env cannot be null")
	}

	Files.copyFolder("frontend/", "dist/") // todo use Paths.js

	Transpiler(env, jsFiles)

	const names = Files.at(Paths.client)
		.filter(f => f.endsWith(".html") || f.endsWith(".md"))
		.map(f => f.split("/").pop().replace(/\.html$/, "").replace(/\.md$/, ""))

	const seen = new Set()
	for (const name of names) {
		if (seen.has(name)) {
			throw new Error(`Duplicate file name found: ${name}`)
		}
		seen.add(name)
	}

	const htmlContents = PrepareIndexHtml()
	GenerateIndexJs(htmlContents)

}

import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	const env = process.argv[2]
	GenerateFrontend(env)
}
