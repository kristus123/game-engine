import { AllImports } from "#root/AllImports.js"
const { Files, Paths, Markdown } = AllImports

export function GenerateIndexJs() {

	const htmlContents = Files.at(Paths.frontendFolder) // rename to htmlTemplates
		.filter(f => !f.includes("index.html"))
		.filter(f => f.endsWith(".html") || f.endsWith(".md"))
		.map(f => {
			console.log(f)
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
			console.log(name)

			return JSON.stringify({ name: name, content: content })
		})

	let fileContent = Files.read(Paths.dist.index_js)

	const asepriteFiles = Files.at(Paths.frontendFolder)
		.filter(f => f.endsWith(".aseprite"))
		.map(f => f.split("/").pop().replace(".aseprite", ""))
		.map(name => `"/generatedAseprite/${name}/${name}"`)

	const audioFiles = Files.at(Paths.frontendFolder)
		.filter(f => f.match(/\.(mp3|wav)$/i))
		.map(f => f.startsWith("frontend/") ? f.substring("frontend/".length) : f)
		.map(f => `"/${f}"`)
		.map(f => f.replace(/\\/g, "/"))

	const imageFiles = Files.at(Paths.frontendFolder)
		.filter(f => f.match(/\.(png|jpg|jpeg|gif)$/i))
		.map(f => f.startsWith("frontend/") ? f.substring("frontend/".length) : f)
		.map(f => `"/${f}"`)
		.map(f => f.replace(/\\/g, "/"))

	fileContent = fileContent.replaceAll("ASEPRITE_FILES", `[${asepriteFiles}]`)
	fileContent = fileContent.replaceAll("HTML_CONTENTS", `[${htmlContents}]`)
	fileContent = fileContent.replaceAll("AUDIO_FILES", `[${audioFiles}]`)
	fileContent = fileContent.replaceAll("IMAGE_FILES", `[${imageFiles}]`)

	Files.write(Paths.dist.index_js, fileContent)
}
