import assert from "node:assert/strict"
import { test } from "node:test"
import { readFileSync } from "node:fs"
import { TranspileContent } from "../transpiler/TranspileContent.js"

const base = {
	IfCondition: { validate: Boolean },
	Assert: { notNull: value => assert.ok(value != null) },
}

function load(file, globals, name) {
	const source = TranspileContent(file, readFileSync(file, "utf8"), []).replace(/^import .*$/gm, "").replace(/^export (async function|function|class) /gm, "$1 ").replace("export default", "const definition =")
	return new Function(...Object.keys(globals), source + `\nreturn ${name}`)(...Object.values(globals))
}

function element() {
	return {
		value: "", disabled: false, hidden: false, textContent: "", listeners: {},
		classList: { toggle() {} },
		addEventListener(event, callback) {
			this.listeners[event] = callback
		},
		async click() {
			if (!this.disabled) {
				await this.listeners.click?.()
			}
		},
	}
}

function pageFixture() {
	const recordings = []
	const translations = []
	const speech = []
	const RecordAudio = async ({ signal }) => {
		const recording = {
			cancelled: false,
			stop: async () => new Blob(["spoken phrase"], { type: "audio/webm" }),
			cancel() {
				this.cancelled = true
			},
		}
		recordings.push({ recording, signal })
		return recording
	}
	const TranslateRecording = async (_blob, sourceLanguage, targetLanguage, signal) => {
		translations.push({ sourceLanguage, targetLanguage, signal })
		return { source: "spoken phrase", sourceLanguage: "en", targetLanguage: "ja", translation: "翻訳" }
	}
	const Tts = async (text, options) => speech.push({ text, ...options })
	const file = "frontend/apps/Google_Translate/translate-page.js"
	const definition = load(file, { ...base, RecordAudio, TranslateRecording, Tts, AbortController, Blob }, "definition")
	const html = Object.fromEntries(["toggleRecording", "clearResult", "translationStatus", "translationResult", "translationDirection", "translationDirectionSelect", "sourceText", "translatedText"].map(key => [key, element()]))
	html.translationDirectionSelect.value = "en-ja"
	html.fields = definition.fields()
	definition.onFirstDomAdd({ html })
	return { html, recordings, translations, speech, remove: () => definition.onDomRemove({ html }) }
}

test("Start and Stop use the selected direction and speak with Tts", async () => {
	const f = pageFixture()
	await f.html.toggleRecording.click()
	assert.equal(f.html.toggleRecording.textContent, "Stop")
	await f.html.toggleRecording.click()
	assert.equal(f.html.translationResult.hidden, false)
	assert.equal(f.html.translationDirection.textContent, "English → Japanese")
	assert.equal(f.html.sourceText.textContent, "spoken phrase")
	assert.equal(f.html.translatedText.textContent, "翻訳")
	assert.equal(f.translations[0].sourceLanguage, "en")
	assert.equal(f.translations[0].targetLanguage, "ja")
	assert.deepEqual(f.speech, [{ text: "翻訳", language: "ja" }])
	assert.equal(f.html.toggleRecording.textContent, "Start")
})

test("Clear result removes the single output", async () => {
	const f = pageFixture()
	await f.html.toggleRecording.click()
	await f.html.toggleRecording.click()
	await f.html.clearResult.click()
	assert.equal(f.html.translationResult.hidden, true)
	assert.equal(f.html.sourceText.textContent, "")
	assert.equal(f.html.translatedText.textContent, "")
})

test("leaving during recording cancels microphone capture", async () => {
	const f = pageFixture()
	await f.html.toggleRecording.click()
	f.remove()
	assert.equal(f.recordings[0].recording.cancelled, true)
	assert.equal(f.recordings[0].signal.aborted, true)
})

test("backend translates in the selected direction and returns text only", async () => {
	const route = {}
	const requests = []
	const endpoint = "backend/http/endpoints/TranslateTextEndpoint.js"
	load(endpoint, {
		...base, UnsecureRoute: route, Secrets: { openAiToken: "private" },
		fetch: async (url, options) => {
			requests.push({ url, body: JSON.parse(options.body) })
			return { ok: true, json: async () => ({ output: [{ content: [{ type: "output_text", text: JSON.stringify({ sourceLanguage: "en", translation: "こんにちは" }) }] }] }) }
		},
	}, "UnsecureRoute")
	const result = await route.translateText({ body: { text: "hello", sourceLanguage: "en", targetLanguage: "ja" }, userId: "user" })
	assert.equal(requests[0].body.model, "gpt-6-astra")
	assert.equal(result.sourceLanguage, "en")
	assert.equal(result.targetLanguage, "ja")
	assert.equal(result.translation, "こんにちは")
	assert.equal(result.audio, undefined)
})

test("shared Tts selects the requested language and rejects when speech is unavailable", async () => {
	const voices = [{ lang: "en-US" }, { lang: "ja-JP" }]
	let utterance
	const synthesis = {
		getVoices: () => voices,
		cancel() {},
		speak(value) {
			utterance = value; value.onend()
		},
	}
	const tts = load("frontend/tools/ai/google/Tts.js", {
		...base, globalThis: { speechSynthesis: synthesis }, speechSynthesis: synthesis,
		SpeechSynthesisUtterance: class {
			constructor(text) {
				this.text = text
			}
		},
		TtsVoices: { active: voices[0] },
	}, "Tts")
	await tts("こんにちは", { language: "ja" })
	assert.equal(utterance.voice, voices[1])
	assert.equal(utterance.lang, "ja")
	const unavailable = load("frontend/tools/ai/google/Tts.js", { ...base, globalThis: {} }, "Tts")
	await assert.rejects(unavailable("Hello"), /unavailable/)
})
