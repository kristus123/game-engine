import { AllImports } from "#root/AllImports.js"
const { Files, Paths, Markdown } = AllImports

export function PrepareIndexHtml() {

	const asepriteFiles = Files.at(Paths.asepriteAssets)
		.map(f => f.replace("\\aseprite", "")) // windows compability // is this needed?
		.map(f => f.replace(".aseprite", ""))
		.map(f => f.startsWith("frontend/") ? f.substring("frontend/".length) : f)
		.map(f => `/${f}`)
		.map(f => `"${f}"`)
		.map(f => f.replace(/\\/g, "/"))

	Files.write(Paths.engineIndex, Files.read(Paths.engineIndex).replaceAll("ASEPRITE_FILES", `[${asepriteFiles}]`))

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

	Files.write(Paths.engineIndex, Files.read(Paths.engineIndex).replaceAll("HTML_CONTENTS", `[${htmlContents}]`))

	const audioFiles = Files.at(Paths.gameAudio)
		.filter(f => f.toLowerCase().endsWith(".mp3"))
		.map(f => f.startsWith("frontend/") ? f.substring("frontend/".length) : f)
		.map(f => `/${f}`)
		.map(f => `"${f}"`)
		.map(f => f.replace(/\\/g, "/"))

	Files.write(Paths.engineIndex, Files.read(Paths.engineIndex).replaceAll("AUDIO_FILES", `[${audioFiles}]`))

	const cssImports = Files.at(Paths.cssFolder)
		.map(f => f.replaceAll("\\", "/")) // windows compability
		.map(f => Files.read(f))
		.join("\n")

	const indexHtml = Files.read(Paths.index_html)
		.replace("CSS_IMPORTS", cssImports)

	Files.write(Paths.toDistPath(Paths.index_html), indexHtml)
}
