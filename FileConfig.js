import path from "path"

export const FileConfig = {
	game: "client/game",
	engine: "client/engine",
	buildTools: "dev/build_tools",

	client: "client",
	dist: "dist",

	asepriteToJson: "dev/build_tools/aseprite_to_json.lua",
	exportAseprite: "dev/build_tools/ExportAseprite.js",
	generateDist: "dev/build_tools/GenerateDist.js",
	engineIndex: "dist/client/engine/start/index.js",

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
		const regex = new RegExp(`^${FileConfig.client}[\\/\\\\]`)
		return filePath.replace(regex, "")
	},

	toDistPath(filePath) {
		return path.join(FileConfig.dist, filePath)
	},
}
