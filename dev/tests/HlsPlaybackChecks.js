import assert from "node:assert/strict"
import { test } from "node:test"
import { readFileSync } from "node:fs"
import { TranspileContent } from "../transpiler/TranspileContent.js"

function fixture({ native = false, deferredLibrary = false } = {}) {
	const instances = []
	let imports = 0
	let resolveLibrary
	const library = new Promise(resolve => {
		resolveLibrary = resolve
	})
	class MockHls {
		static Events = { ERROR: "error", MANIFEST_PARSED: "manifest" }
		static isSupported() {
			return true
		}

		constructor() {
			this.handlers = new Map()
			this.destroyed = false
			instances.push(this)
		}

		on(event, callback) {
			this.handlers.set(event, callback)
		}

		emit(event, data) {
			this.handlers.get(event)?.(event, data)
		}

		loadSource(source) {
			this.source = source
		}

		attachMedia(video) {
			this.media = video
		}

		destroy() {
			this.destroyed = true; this.media = null
		}
	}
	const file = new URL("../../frontend/apps/livestream/livestream_viewer/HLS/HlsJs.js", import.meta.url)
	let source = TranspileContent(file.pathname, readFileSync(file, "utf8"), [])
	source = source.replace("import(\"./hls.mjs\")", "loadLibrary()").replace("export ", "")
	const Player = new Function("SuperClass", "IfCondition", "Assert", "navigator", "console", "loadLibrary", source + "\nreturn HlsJs")(
		class {}, { validate: Boolean }, { notNull: value => assert.ok(value != null) },
		{ userAgent: "test TV" }, { log() {}, warn() {} },
		() => {
			imports++
			return deferredLibrary ? library : Promise.resolve({ default: MockHls })
		},
	)
	const listeners = new Map()
	const video = {
		error: null, readyState: 0, networkState: 0,
		canPlayType: () => native ? "maybe" : "",
		addEventListener: (type, callback) => {
			if (!listeners.has(type)) {
				listeners.set(type, new Set())
			}
			listeners.get(type).add(callback)
		},
		removeEventListener: (type, callback) => listeners.get(type)?.delete(callback),
		removeAttribute(name) {
			delete this[name]
		},
		pause() {}, load() {},
	}
	const emit = type => {
		for (const callback of [...(listeners.get(type) ?? [])]) {
			callback()
		}
	}
	return { Player, video, emit, instances, listeners, imports: () => imports, resolveLibrary: () => resolveLibrary({ default: MockHls }) }
}

const settle = () => new Promise(resolve => setImmediate(resolve))

test("native HLS starts without importing hls.js and invokes playback when metadata arrives", async () => {
	const f = fixture({ native: true })
	let ready = 0
	await f.Player.connect(f.video, "https://example.test/live.m3u8", { onManifestParsed: () => ready++ })
	assert.equal(f.Player.engine, "native")
	assert.equal(f.video.src, "https://example.test/live.m3u8")
	assert.equal(f.imports(), 0)
	f.emit("loadedmetadata")
	assert.equal(ready, 1)
	f.Player.disconnect()
	f.emit("loadedmetadata")
	assert.equal(ready, 1)
	assert.equal(f.Player.connected, false)
})

test("native failure falls back once to hls.js, and failure of both engines reaches the viewer", async () => {
	const f = fixture({ native: true })
	const failures = []
	await f.Player.connect(f.video, "live.m3u8", { onError: error => {
		failures.push(error); f.Player.disconnect()
	} })
	f.video.error = { code: 4, message: "Native source unsupported" }
	f.emit("error")
	await settle()
	assert.equal(f.Player.engine, "hls.js")
	assert.equal(f.instances.length, 1)
	assert.equal(failures.length, 0)
	f.instances[0].emit("error", { fatal: true, type: "mediaError", details: "bufferAddCodecError" })
	assert.equal(failures.length, 1)
	assert.match(failures[0].message, /bufferAddCodecError/)
	assert.equal(f.Player.connected, false)
	assert.equal(f.instances[0].destroyed, true)
})

test("nonfatal hls.js stalls and aborted requests keep the current connection", async () => {
	const f = fixture()
	let ready = 0
	await f.Player.connect(f.video, "live.m3u8", { onError: () => assert.fail("recoverable errors must not reconnect"), onManifestParsed: () => ready++ })
	assert.equal(f.Player.engine, "hls.js")
	f.instances[0].emit("error", { fatal: false, type: "mediaError", details: "bufferStalledError" })
	f.instances[0].emit("error", { fatal: false, type: "networkError", details: "aborted" })
	f.instances[0].emit("manifest")
	assert.equal(ready, 1)
	assert.equal(f.instances[0].destroyed, false)
	f.Player.disconnect()
})

test("media failure destroys the decoder; reconnect builds a fresh one and ignores old events", async () => {
	const f = fixture()
	let failures = 0
	let ready = 0
	const callbacks = { onError: error => {
		assert.equal(error.code, 3); failures++; f.Player.disconnect()
	}, onManifestParsed: () => ready++ }
	await f.Player.connect(f.video, "live.m3u8", callbacks)
	f.video.error = { code: 3, message: "Decoder failed" }
	f.emit("error")
	assert.equal(failures, 1)
	assert.equal(f.instances[0].destroyed, true)
	await f.Player.connect(f.video, "live.m3u8", callbacks)
	assert.equal(f.instances.length, 2)
	assert.equal(f.instances[1].destroyed, false)
	f.instances[0].emit("error", { fatal: true })
	f.instances[0].emit("manifest")
	assert.equal(failures, 1)
	assert.equal(ready, 0)
	f.Player.disconnect()
})

test("disconnect during library loading prevents a late attachment", async () => {
	const f = fixture({ deferredLibrary: true })
	const pending = f.Player.connect(f.video, "live.m3u8")
	f.Player.disconnect()
	f.resolveLibrary()
	await pending
	assert.equal(f.instances.length, 0)
	assert.equal(f.Player.connected, false)
	assert.equal(f.listeners.size, 0)
})
