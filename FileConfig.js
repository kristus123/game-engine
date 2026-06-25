export const FileConfig = {
	frontend: "frontend",
	backend: "backend",
	shared: "shared",
	game: "frontend/client/game",
	engine: "frontend/client/engine",
	buildTools: "dev",

	client: "frontend/client",
	favicon: "frontend/favicon.ico",
	dist: "dist",
	transpiledBackend: "transpiledBackend",

	externalBundle: "bundle.js",

	asepriteToJson: "dev/aseprite_to_json.lua",
	exportAseprite: "dev/ExportAseprite.js",
	generateDist: "dev/GenerateDist.js",
	prepareExternalBundle: "dev/PrepareExternalBundle.js",
	engineIndex: "dist/index.js",
	externalBundleDistPath: "dist/out.js",

	get gameAssets() {
		return `${this.game}/assets`
	},

	get gameAudio() {
		return `${this.game}/audio`
	},

	get asepriteAssets() {
		return `${this.game}/assets/aseprite`
	},

	get cssFolder() {
		return `${this.frontend}/ui/css`
	},

	get index_html() {
		return `${this.frontend}/index.html`
	},

	toDistPath(path) {
		if (path.startsWith("frontend/")) {
			// is this needed? attempt to remove replaceAll on windows and see if it still works
			const p = path.replaceAll("\\", "/").replace("frontend/", "")
			return `${FileConfig.dist}/${p}`
		}
		else {
			throw new Error(path + " does not start with frontend/")
		}
	},
}
