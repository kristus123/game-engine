export const FileConfig = {

	clientFolder: "client/",

	asepriteToJson: "dev/build_tools/aseprite_to_json.lua",

	exportAseprite: "dev/build_tools/ExportAseprite.js",

	generateDist: "dev/build_tools/GenerateDist.js",

	engineIndex: "dist/client/engine/start/index.js",

	gameAssets: "client/game/assets",

	gameAudio: "client/game/audio",

	asepriteAssets: "client/game/assets/aseprite",

	gameUiCss: "client/game/ui/css",

	gameIndexHtml: "client/game/index.html",

	toDistPath(filePath) {
		return "dist/" + filePath
	},

}
