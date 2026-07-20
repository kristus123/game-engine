import { AllImports } from "#root/AllImports.js"
const { Files, Paths, Markdown } = AllImports

export function GenerateIndexJs(htmlContents) {
	let fileContent = Files.read(Paths.index_js)

	const asepriteFiles = Files.at(Paths.asepriteAssets)
		.map(f => f.replace("\\aseprite", "")) // windows compability // is this needed?
		.map(f => f.replace(".aseprite", ""))
		.map(f => f.startsWith("frontend/") ? f.substring("frontend/".length) : f)
		.map(f => `/${f}`)
		.map(f => `"${f}"`)
		.map(f => f.replace(/\\/g, "/"))

	const audioFiles = Files.at(Paths.gameAudio)
		.filter(f => f.toLowerCase().endsWith(".mp3"))
		.map(f => f.startsWith("frontend/") ? f.substring("frontend/".length) : f)
		.map(f => `/${f}`)
		.map(f => `"${f}"`)
		.map(f => f.replace(/\\/g, "/"))

	fileContent = fileContent.replaceAll("ASEPRITE_FILES", `[${asepriteFiles}]`)
	fileContent = fileContent.replaceAll("HTML_CONTENTS", `[${htmlContents}]`)
	fileContent = fileContent.replaceAll("AUDIO_FILES", `[${audioFiles}]`)

	Files.write(Paths.index_js, fileContent)
}
