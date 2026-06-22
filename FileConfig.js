import path from "path"

export const FileConfig = {
	frontend: "frontend",
	game: "frontend/client/game",
	engine: "frontend/client/engine",
	buildTools: "dev",

	client: "frontend/client",
	dist: "dist",

	externalBundle: "bundle.js",

	asepriteToJson: "dev/aseprite_to_json.lua",
	exportAseprite: "dev/ExportAseprite.js",
	generateDist: "dev/GenerateDist.js",
	prepareExternalBundle: "dev/PrepareExternalBundle.js",
	engineIndex: "dist/client/engine/start/index.js",
	externalBundleDistPath: "dist/out.js",

	get gameAssets() {
		return path.join(this.game, "assets")
	},

	get gameAudio() {
		return path.join(this.game, "audio")
	},

	get asepriteAssets() {
		return path.join(this.game, "assets/aseprite")
	},

	get gameUiCss() {
		return path.join(this.game, "ui/css")
	},

	get gameIndexHtml() {
		return path.join(this.game, "index.html")
	},

	removeClientPathPrefix(filePath) {
		const normalizedPath = filePath.replaceAll("\\", "/")
		const regex = new RegExp(`^${FileConfig.client.replaceAll("\\", "/")}[/]`)
		return normalizedPath.replace(regex, "")
	},

	toDistPath(filePath) {
		const normalizedPath = filePath.replaceAll("\\", "/")
		const relativePath = normalizedPath.startsWith("frontend/") ? normalizedPath.substring("frontend/".length) : normalizedPath
		return path.join(FileConfig.dist, relativePath)
	},
}
