import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { TranspileContent } from "../transpiler/TranspileContent.js"

const file = new URL("../../frontend/index.js", import.meta.url)
const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), [new URL("../../frontend/tools/core/os/db/LocalValue.js", import.meta.url).pathname])
const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor

for (const environment of ["dev", "prod"]) {
	test(`${environment} startup initializes identity and connects before opening the start page`, async () => {
		let initialized = false
		let connected = false
		let opened = false
		const noop = () => {}
		const dependencies = {
			Env: { dev: environment == "dev", prod: environment == "prod" },
			Log: { sendConsoleToServer: noop },
			document: { getElementById: () => ({ remove: noop }), addEventListener: noop },
			devicePixelRatio: 1,
			setInterval: noop,
			LocalValue: class {
				constructor(key, value) {
					this.value = value
				}
			},
			SocketClient: {
				onServerMessage: noop,
				connect: async () => {
					assert.equal(initialized, true)
					connected = true
				},
			},
			ServiceWorker: { unregister: noop },
			Ableton: { init: noop },
			Netlify: { name: "romskip-streamer" },
			InjectGlobalAttributeLogicToHtml: noop,
			AssetPaths: { htmlComponent: [], aseprite: [], audio: [], image: [] },
			RegisterCustomWebComponent: noop,
			Page: { start: async tag => {
				assert.equal(tag, "start-page")
				assert.equal(initialized, true)
				assert.equal(connected, true)
				opened = true
			} },
			Font: { load: noop, use: noop },
			Css: { use: noop },
			Retry: async (attempts, callback) => callback(0),
			Network: { httpCheck: noop },
			Token: { init: async () => {
				await Promise.resolve()
				initialized = true
			} },
			LoadAsepriteAssets: noop,
			LoadAllAudio: noop,
			LoadAllImages: noop,
			location: { search: "" },
			URLSearchParams,
			IfCondition: { validate: Boolean },
		}
		await new AsyncFunction(...Object.keys(dependencies), source)(...Object.values(dependencies))
		assert.equal(opened, true)
	})
}
