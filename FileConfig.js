export const FileConfig = {
	frontend: "frontend",
	backend: "backend",
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
		const normalizedPath = path.replaceAll("\\", "/")

		if (normalizedPath.startsWith("frontend/")) {
			const normalizedDistPath = normalizedPath.replace("frontend/", "")
			return `${FileConfig.dist}/${normalizedDistPath}`
		}
		else {
			throw new Error(path + " does not start with frontend/")
		}
	},
}
