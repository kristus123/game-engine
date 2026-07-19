export class Paths {
	static frontend = "frontend"
	static backend = "backend"
	static shared = "shared"
	static game = "frontend/client/game"
	static engine = "frontend/client/engine"
	static buildTools = "dev"

	static client = "frontend/client"
	static favicon = "frontend/favicon.ico"
	static dist = "dist"
	static transpiledBackend = "transpiledBackend"
	static transpiledShared = "transpiledShared"

	static externalBundle = "bundle.js"

	static asepriteToJson = "dev/aseprite_to_json.lua"
	static exportAseprite = "dev/ExportAseprite.js"
	static generateDist = "dev/GenerateFrontend.js"
	static prepareExternalBundle = "dev/PrepareExternalBundle.js"
	static index_js = "dist/index.js"
	static externalBundleDistPath = "dist/out.js"

	static get gameAssets() {
		return `${this.game}/assets`
	}

	static get gameAudio() {
		return `${this.game}/audio`
	}

	static get asepriteAssets() {
		return `${this.game}/assets/aseprite`
	}

	static get cssFolder() {
		return `${this.frontend}/ui/css`
	}

	static get index_html() {
		return `${this.frontend}/index.html`
	}

	static toDistPath(path) {
		if (path.startsWith("frontend/")) {
			// is this needed? attempt to remove replaceAll on windows and see if it still works
			const p = path.replaceAll("\\", "/").replace("frontend/", "")
			return `${Paths.dist}/${p}`
		}
		else {
			throw new Error(path + " does not start with frontend/")
		}
	}
}