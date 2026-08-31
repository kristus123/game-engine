import { AllImports } from "#root/AllImports.js"
const { Files, Paths, Markdown } = AllImports

export function GenerateIndexJs() {

	const customWebComponents = Files.at(Paths.frontendFolder)
		.filter(f => f.endsWith(".html") && f.includes("-"))
		.map(f => {
			const content = Files.read(f)
				.replace("\n", "")
				.replace(/\s+/g, " ")
				.trim()

			const name = f.split("/").pop()
				.replace(".html", "")

			let js = Files.findPathOrNull(name + ".js")
			if (js) {
				js = js.replace("frontend/", "#root/")
			}
			console.log("_____________xxx")
			console.log(js)
			console.log("_____________xxx")

			return JSON.stringify({
				name: name,
				content: content,
				js: js,
			})
		})

	const htmlContents = Files.at(Paths.frontendFolder) // rename to htmlTemplates
		.filter(f => !f.includes("index.html"))
		.filter(f => !f.includes("-"))
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


	let fileContent = Files.read(Paths.dist.assetPaths)
	fileContent = fileContent.replaceAll("ASEPRITE_FILES", `[${asepriteFiles}]`)
	fileContent = fileContent.replaceAll("HTML_CONTENTS", `[${htmlContents}]`)
	fileContent = fileContent.replaceAll("CUSTOM_WEB_COMPONENTS", `[${customWebComponents}]`)
	fileContent = fileContent.replaceAll("AUDIO_FILES", `[${audioFiles}]`)
	fileContent = fileContent.replaceAll("IMAGE_FILES", `[${imageFiles}]`)

	Files.write(Paths.dist.assetPaths, fileContent)
}
