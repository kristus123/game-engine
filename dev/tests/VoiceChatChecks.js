import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { Readable } from "node:stream"
import { EventEmitter } from "node:events"
import { spawnSync } from "node:child_process"
import { TranspileContent } from "../transpiler/TranspileContent.js"

function load(path, name, dependencies) {
	const file = new URL("../../" + path, import.meta.url)
	const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), []).replace(/^import .*$/gm, "")
	const runtime = { Assert: { notNull: value => assert.ok(value != null) }, IfCondition: { validate: Boolean }, ...dependencies }
	return new Function(...Object.keys(runtime), source.replace("export ", "") + `\nreturn ${name}`)(...Object.values(runtime))
}

test("transcription sends the native audio file and local secret without forcing English", async () => {
	let request
	const transcribe = load("backend/ai/TranscribeAudio.js", "TranscribeAudio", {
		Secrets: { openAiToken: "local-test-key" },
		fetch: async (url, options) => {
			request = { url, ...options }
			return { ok: true, json: async () => ({ text: " Spoken message " }) }
		},
	})
	assert.equal(await transcribe(new Blob(["recording"], { type: "audio/webm;codecs=opus" })), "Spoken message")
	assert.equal(request.headers.Authorization, "Bearer local-test-key")
	assert.equal(request.body.get("file").name, "recording.webm")
	assert.equal(request.body.get("language"), null)
	assert.equal(request.body.get("model"), "gpt-4o-mini-transcribe")
})

test("invalid audio is rejected before any request and API errors do not echo credentials", async () => {
	const transcribe = load("backend/ai/TranscribeAudio.js", "TranscribeAudio", {
		Secrets: { openAiToken: "local-test-key" },
		fetch: async () => ({ ok: false, status: 401, text: async () => "local-test-key" }),
	})
	await assert.rejects(transcribe(new Blob([])), /No recorded audio/)
	await assert.rejects(transcribe(new Blob(["bad"], { type: "text/plain" })), /Unsupported audio/)
	await assert.rejects(transcribe(new Blob(["audio"], { type: "audio/mp4" })), { message: "Transcription failed (HTTP 401)" })
})

function recorderFixture() {
	let stops = 0
	let grant
	let constraints
	const track = { stop: () => stops++ }
	const stream = { getTracks: () => [track] }
	class Recorder {
		static isTypeSupported(type) {
			return type == "audio/mp4"
		}

		constructor(_stream, { mimeType }) {
			this.mimeType = mimeType; this.state = "inactive"
		}

		start() {
			this.state = "recording"
		}

		stop() {
			this.state = "inactive"
			queueMicrotask(() => {
				this.ondataavailable({ data: new Blob(["audio"]) })
				this.onstop()
			})
		}
	}
	const record = load("frontend/tools/core/media_recorder/RecordAudio.js", "RecordAudio", {
		navigator: { mediaDevices: { getUserMedia: options => {
			constraints = options
			return new Promise(resolve => {
				grant = () => resolve(stream)
			})
		} } },
		MediaRecorder: Recorder,
	})
	return { record, grant: () => grant(), get stops() {
		return stops
	}, get constraints() {
		return constraints
	} }
}

test("recording requests only microphone access, selects a supported format, and releases its own tracks", async () => {
	const f = recorderFixture()
	const pending = f.record()
	f.grant()
	const recording = await pending
	const blob = await recording.stop()
	assert.deepEqual(f.constraints, { audio: true })
	assert.equal(blob.type, "audio/mp4")
	assert.ok(blob.size > 0)
	assert.equal(f.stops, 1)
})

test("closing chat while microphone permission is pending releases the late stream", async () => {
	const f = recorderFixture()
	const controller = new AbortController()
	const pending = f.record({ signal: controller.signal })
	controller.abort()
	f.grant()
	await assert.rejects(pending, { name: "AbortError" })
	assert.equal(f.stops, 1)
})

function chatFixture(supported = true) {
	const file = new URL("../../frontend/apps/livestream/chat-page/chat-page.js", import.meta.url)
	const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), []).replace(/^import .*$/gm, "")
	let finishTranscript
	let cancelled = false
	const options = new Function("RecordAudio", "Transcribe", "IfCondition", "Assert", "navigator", "MediaRecorder", "globalThis", "Chat", source.replace("export default", "return"))(
		async () => ({ stop: async () => new Blob(["audio"], { type: "audio/webm" }), cancel: () => {
			cancelled = true
		} }),
		() => new Promise(resolve => {
			finishTranscript = resolve
		}),
		{ validate: Boolean }, { notNull: value => assert.ok(value != null) },
		supported ? { mediaDevices: { getUserMedia() {} } } : {}, class {}, { isSecureContext: true }, { history: [], onMessage() {} },
	)
	const html = { fields: options.fields(), dictate: {}, dictationStatus: {}, message: { value: "Draft", focus() {} }, isConnected: true }
	return { options, html, finish: value => finishTranscript(value), get cancelled() {
		return cancelled
	} }
}

test("dictation appends to the draft for review instead of sending it", async () => {
	const { options, html, finish } = chatFixture()
	await options.methods.toggleDictation(html)
	assert.equal(html.fields.voiceState, "recording")
	const stopping = options.methods.toggleDictation(html)
	await Promise.resolve()
	finish("spoken words")
	await stopping
	assert.equal(html.message.value, "Draft spoken words")
	assert.equal(html.fields.voiceState, "idle")
	options.onDomRemove({ html })
})

test("closing chat aborts transcription and ignores its late result", async () => {
	const { options, html, finish } = chatFixture()
	await options.methods.toggleDictation(html)
	const stopping = options.methods.toggleDictation(html)
	await Promise.resolve()
	options.onDomRemove({ html })
	html.isConnected = false
	finish("late result")
	await stopping
	assert.equal(html.message.value, "Draft")
	assert.equal(html.fields.voiceController, null)
})


test("browser transcription sends audio to the backend without browser API credentials and supports cancellation", async () => {
	let request
	const transcribe = load("frontend/tools/ai/openai/Transcribe.js", "Transcribe", {
		Config: { httpUrl: "https://backend.test" },
		Token: { encodedToken: "signed-session-token" },
		fetch: async (url, options) => {
			request = { url, ...options }
			return { ok: true, json: async () => ({ text: " spoken words " }) }
		},
	})
	const controller = new AbortController()
	const blob = new Blob(["recording"], { type: "audio/mp4" })
	assert.equal(await transcribe(blob, { signal: controller.signal }), "spoken words")
	assert.equal(request.url, "https://backend.test/transcribeAudio?type=audio%2Fmp4")
	assert.equal(request.body, blob)
	assert.equal(request.headers["Content-Type"], "application/octet-stream")
	assert.equal(request.headers.token, "signed-session-token")
	assert.equal(request.headers.Authorization, undefined)
	controller.abort()
	assert.equal(request.signal.aborted, true)
})

function endpointFixture(transcribe) {
	const file = new URL("../../backend/http/endpoints/TranscriptionEndpoint.js", import.meta.url)
	const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), [])
	const routes = {}
	new Function("UnsecureRoute", "TranscribeAudio", "IfCondition", "Assert", source)(routes, transcribe, { validate: Boolean }, { notNull: value => assert.ok(value != null) })
	const request = (userId, chunks = [Buffer.from("audio")]) => ({ req: Readable.from(chunks), res: new EventEmitter(), params: { type: "audio/mp4" }, userId })
	return { run: routes.transcribeAudio, request }
}

test("backend transcription preserves the recording format and releases its concurrency slot", async () => {
	let received
	const f = endpointFixture(async blob => {
		received = blob
		return "spoken words"
	})
	const request = f.request("user")
	assert.deepEqual(await f.run(request), { text: "spoken words" })
	assert.equal(received.type, "audio/mp4")
	assert.equal(await received.text(), "audio")
	assert.equal(request.res.listenerCount("close"), 0)
	assert.deepEqual(await f.run(f.request("user")), { text: "spoken words" })
})

test("oversized uploads are rejected before contacting OpenAI", async () => {
	const f = endpointFixture(async () => assert.fail("oversized media must not be transcribed"))
	await assert.rejects(f.run(f.request("user", [Buffer.alloc(25 * 1024 * 1024 + 1)])), /25 MB/)
})

test("closing the response cancels upstream transcription and duplicate requests are bounded", async () => {
	let started
	const ready = new Promise(resolve => {
		started = resolve
	})
	const f = endpointFixture((_blob, { signal }) => new Promise((resolve, reject) => {
		started()
		signal.addEventListener("abort", () => reject(new Error("cancelled")), { once: true })
	}))
	const request = f.request("user")
	const pending = f.run(request)
	await ready
	await assert.rejects(f.run(f.request("user")), /busy/)
	request.res.emit("close")
	await assert.rejects(pending, /cancelled/)
	assert.equal(request.res.listenerCount("close"), 0)
})


test("Speak is visible on supported devices in production and hidden without microphone support", () => {
	const supported = chatFixture()
	supported.options.onFirstDomAdd({ html: supported.html })
	assert.equal(supported.html.dictate.hidden, false)
	const unsupported = chatFixture(false)
	unsupported.options.onFirstDomAdd({ html: unsupported.html })
	assert.equal(unsupported.html.dictate.hidden, true)
})


test("backend Object enhancements allow Node to configure hostname connections", () => {
	const native = new URL("../../shared/enhance/NativeEnhancer.js", import.meta.url).href
	const object = new URL("../../shared/enhance/js/Enhance_js_Object.js", import.meta.url).href
	const script = String.raw`
		import assert from "node:assert/strict";
		import { readFileSync } from "node:fs";
		import { createConnection } from "node:net";
		import { NativeEnhancer } from ${JSON.stringify(native)};
		const source = readFileSync(new URL(${JSON.stringify(object)}), "utf8").replace("export class", "class");
		const Enhance = new Function("NativeEnhancer", source + "\nreturn Enhance_js_Object")(NativeEnhancer);
		new Enhance();
		const socket = createConnection({host: "example.invalid", port: 443, lookup(host, options, callback) {
			callback(Object.assign(new Error("Expected test lookup failure"), {code: "ETESTLOOKUP"}));
		}});
		socket.on("error", error => {assert.equal(error.code, "ETESTLOOKUP"); socket.destroy()});
	`
	const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8", timeout: 5_000 })
	assert.equal(result.status, 0, result.stderr)
})
