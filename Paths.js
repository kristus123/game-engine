export class Paths {
	static frontendFolder = "frontend"
	static backendFolder = "backend"
	static sharedFolder = "shared"
	static devFolder = "dev"
	static distFolder = "dist"
	static transpiledBackend = "transpiledBackend"
	static transpiledShared = "transpiledShared"

	static favicon = "frontend/favicon.ico"
	static externalBundle = "bundle.js"
	static asepriteToJson = "dev/aseprite_to_json.lua"
	static exportAseprite = "dev/ExportAseprite.js"
	static generateDist = "dev/GenerateFrontend.js"
	static prepareExternalBundle = "dev/PrepareExternalBundle.js"

	static get dist() {
		return {
			index_js: "dist/index.js",
			assetPaths: "dist/AssetPaths.js",
			externalBundle: "dist/out.js"
		}
	}

	static get gameAssets() {
		return `${this.frontendFolder}/assets`
	}

	static get cssFolder() {
		return `${this.frontendFolder}/ui/css`
	}

	static get index_html() {
		return `${this.frontendFolder}/index.html`
	}

	static toDistPath(path) {
		if (path.startsWith("frontend/")) {
			// is this needed? attempt to remove replaceAll on windows and see if it still works
			const p = path.replaceAll("\\", "/").replace("frontend/", "")
			return `${Paths.distFolder}/${p}`
		}
		else {
			throw new Error(path + " does not start with frontend/")
		}
	}
}
