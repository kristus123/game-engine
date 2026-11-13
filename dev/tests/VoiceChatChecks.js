import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { TranspileContent } from "../transpiler/TranspileContent.js"

function load(path, name, dependencies) {
	const file = new URL("../../" + path, import.meta.url)
	const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), [])
	const runtime = { Assert: { notNull: value => assert.ok(value != null) }, IfCondition: { validate: Boolean }, ...dependencies }
	return new Function(...Object.keys(runtime), source.replace("export ", "") + `\nreturn ${name}`)(...Object.values(runtime))
}

test("transcription sends the native audio file and local secret without forcing English", async () => {
	let request
	const transcribe = load("frontend/tools/ai/openai/Transcribe.js", "Transcribe", {
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
	const transcribe = load("frontend/tools/ai/openai/Transcribe.js", "Transcribe", {
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

function chatFixture() {
	const file = new URL("../../frontend/apps/livestream/chat-page/chat-page.js", import.meta.url)
	const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), [])
	let finishTranscript
	let cancelled = false
	const options = new Function("RecordAudio", "Transcribe", "IfCondition", "Assert", source.replace("export default", "return"))(
		async () => ({ stop: async () => new Blob(["audio"], { type: "audio/webm" }), cancel: () => {
			cancelled = true
		} }),
		() => new Promise(resolve => {
			finishTranscript = resolve
		}),
		{ validate: Boolean }, { notNull: value => assert.ok(value != null) },
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
