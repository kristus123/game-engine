import { AllImports } from "#root/AllImports.js"
const { Files, Paths, Markdown } = AllImports

export function GenerateIndexJs(htmlContents) {
	let fileContent = Files.read(Paths.index_js)

	const asepriteFiles = Files.at(Paths.frontend)
		.filter(f => f.endsWith(".aseprite"))
		.map(f => f.split("/").pop().replace(".aseprite", ""))
		.map(name => `"/generatedAseprite/${name}/${name}"`)

	const audioFiles = Files.at(Paths.frontend)
		.filter(f => f.match(/\.(mp3|wav)$/i))
		.map(f => f.startsWith("frontend/") ? f.substring("frontend/".length) : f)
		.map(f => `"/${f}"`)
		.map(f => f.replace(/\\/g, "/"))

	const imageFiles = Files.at(Paths.frontend)
		.filter(f => f.match(/\.(png|jpg|jpeg|gif)$/i))
		.map(f => f.startsWith("frontend/") ? f.substring("frontend/".length) : f)
		.map(f => `"/${f}"`)
		.map(f => f.replace(/\\/g, "/"))

	fileContent = fileContent.replaceAll("ASEPRITE_FILES", `[${asepriteFiles}]`)
	fileContent = fileContent.replaceAll("HTML_CONTENTS", `[${htmlContents}]`)
	fileContent = fileContent.replaceAll("AUDIO_FILES", `[${audioFiles}]`)
	fileContent = fileContent.replaceAll("IMAGE_FILES", `[${imageFiles}]`)

	Files.write(Paths.index_js, fileContent)
}
