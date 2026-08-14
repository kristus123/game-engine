import { AllImports } from "#root/AllImports.js"
const { Files, Paths, Markdown } = AllImports

export function GenerateIndexJs(htmlContents) {
	let fileContent = Files.read(Paths.dist.index_js)

	const webComponentFiles = Files.at(Paths.frontendFolder)
		.filter(f => f.includes("-"))
		.filter(f => f.endsWith(".html"))
		.map(f => ({
			name: f.split("/").pop().replace(".html", ""),
			path: f.replace("frontend", "")
		}))
	
	console.log(webComponentFiles)

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
	fileContent = fileContent.replaceAll("WEB_COMPONENTS", `${JSON.stringify(webComponentFiles)}`)

	Files.write(Paths.dist.index_js, fileContent)
}
