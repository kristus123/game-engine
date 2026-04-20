import Files from "#root/dev/build_tools/Files.js"
import { FileConfig } from "#root/FileConfig.js"
import { Markdown } from "#root/dev/build_tools/Markdown.js"

// nabir todo fix absolute paths
import "./Transpiler.js"

Files.copyFolder(FileConfig.gameAssets, FileConfig.toDistPath(FileConfig.gameAssets))
Files.copyFolder(FileConfig.gameAudio, FileConfig.toDistPath(FileConfig.gameAudio))

// nabir todo fix absolute paths
import "./CopyManifestToDist.js"
import "./VerifyNoReservedClashes.js"
import "./AssertUniqueFileNames.js"

const asepriteFiles = Files.at(FileConfig.asepriteAssets)
	.map(f => f.replace("\\aseprite", "")) // windows compability
	.map(f => f.replace(".aseprite", ""))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, "/"))
Files.replace(FileConfig.engineIndex, "ASEPRITE_FILES", `[${asepriteFiles}]`)


const names = Files.at(FileConfig.client)
	.filter(f => f.endsWith(".html") || f.endsWith(".md"))
	.map(f => f.split("/").pop().replace(/\.html$/, "").replace(/\.md$/, ""))

const seen = new Set()
for (const name of names) {
	if (seen.has(name)) {
		throw new Error(`Duplicate file name found: ${name}`)
	}
	seen.add(name)
}

const htmlContents = Files.at(FileConfig.client)
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

Files.replace(FileConfig.engineIndex, "HTML_CONTENTS", `[${htmlContents}]`)


const audioFiles = Files.at(FileConfig.gameAudio)
	.filter(f => f.toLowerCase().endsWith(".mp3"))
	.map(f => f.replace("/aseprite", ""))
	.map(f => f.replace("\\aseprite", "")) // windows compability
	.map(f => f.replace(".aseprite", ""))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, "/"))
Files.replace(FileConfig.engineIndex, "AUDIO_FILES", `[${audioFiles}]`)

const cssImports = Files.at(FileConfig.gameUiCss)
	.map(f => f.replaceAll("\\", "/")) // windows compability
	.map(f => Files.read(f))
	.join("\n")

const indexHtml = Files.read(FileConfig.gameIndexHtml)
	.replace("CSS_IMPORTS", cssImports)
Files.write(FileConfig.toDistPath("index.html"), indexHtml)
