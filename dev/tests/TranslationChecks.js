import assert from "node:assert/strict"
import { test } from "node:test"
import { readFileSync } from "node:fs"
import { TranspileContent } from "../transpiler/TranspileContent.js"

const base = {
	SuperClass: class {},
	IfCondition: { validate(value) {
		if (typeof value == "number") {
			throw new Error("Numbers cannot be used as conditions")
		}
		if (typeof value == "function") {
			throw new Error("Functions cannot be used as conditions")
		}
		return Boolean(value)
	} },
	Assert: { notNull: value => assert.ok(value != null) },
}

function load(file, globals, name) {
	const source = TranspileContent(file, readFileSync(file, "utf8"), []).replace(/^import .*$/gm, "").replace("export class", "class").replace("export async function", "async function").replace("export function", "function")
	return new Function(...Object.keys(globals), source + `\nreturn ${name}`)(...Object.values(globals))
}

function fixture({ microphone } = {}) {
	let now = 0
	let tick
	let level = 0
	const clients = []
	const captures = []
	const revoked = []
	const statuses = []
	const turns = []
	const track = { stop() {
		this.stopped = true
	} }
	const stream = { getTracks: () => [track], getAudioTracks: () => [track] }
	class Audio {
		paused = true
		plays = []
		async play() {
			this.paused = false; this.plays.push(this.src)
		}

		pause() {
			this.paused = true
		}

		removeAttribute() {
			this.src = ""
		}

		load() {}
	}
	class Context {
		async resume() {
			this.state = "running"
		}

		async close() {
			this.state = "closed"
		}

		createMediaStreamSource() {
			return { connect() {}, disconnect() {} }
		}

		createAnalyser() {
			return { getFloatTimeDomainData: samples => samples.fill(level), disconnect() {} }
		}
	}
	class Client {
		constructor() {
			clients.push(this)
		}

		async start(options) {
			this.options = options
			options.onAudioStream({})
			options.onTranscript({ event: { type: "session.input_transcript.delta", delta: "Hello", elapsed_ms: 0 } })
			options.onStatus("listening")
		}

		stop() {
			this.stopped = true
		}
	}
	const detect = load("frontend/apps/Google_Translate/DetectConversationLanguage.js", base, "DetectConversationLanguage")
	const echo = load("frontend/apps/Google_Translate/IsTranslationEcho.js", base, "IsTranslationEcho")
	const update = load("frontend/apps/Google_Translate/UpdateRealtimeCaption.js", { ...base, DetectConversationLanguage: detect }, "UpdateRealtimeCaption")
	const Conversation = load("frontend/apps/Google_Translate/TranslationConversation.js", {
		...base, Audio, RealTimeTranslate: Client, RTCPeerConnection: class {}, MediaRecorder: class {}, window: { AudioContext: Context },
		navigator: { mediaDevices: { getUserMedia: () => microphone || Promise.resolve(stream) } },
		performance: { now: () => now }, setInterval: run => {
			tick = run; return 1
		}, clearInterval: () => {
			tick = null
		},
		URL: { createObjectURL: () => "blob:clip-" + now, revokeObjectURL: url => revoked.push(url) },
		UpdateRealtimeCaption: update, DetectConversationLanguage: detect, IsTranslationEcho: echo,
		CaptureTranslationVoice: (context, remote, onClip) => {
			const capture = { onClip, poll() {}, resume: async () => {}, setMuted(value) {
				this.muted = value
			}, stop() {
				this.stopped = true
			} }
			captures.push(capture)
			return capture
		},
	}, "TranslationConversation")
	const conversation = new Conversation()
	const start = (options = {}) => conversation.start({ ...options, onTranscript: turn => turns.push(turn), onStatus: (status, message) => statuses.push({ status, message }) })
	const advance = async (ms, value = 0) => {
		now += ms; level = value; tick?.(); await Promise.resolve()
	}
	return { conversation, start, advance, stream, track, clients, captures, revoked, turns, statuses }
}

test("both realtime directions share one microphone and report readiness together", async () => {
	const f = fixture(); await f.start()
	assert.deepEqual(f.clients.map(client => client.options.language), ["en", "ja"])
	assert.ok(f.clients.every(client => client.options.stream === f.stream))
	assert.deepEqual(f.statuses.map(state => state.status), ["connecting", "listening"])
	f.conversation.stop()
	assert.ok(f.clients.every(client => client.stopped))
	assert.ok(f.captures.every(capture => capture.stopped))
	assert.equal(f.track.stopped, true)
})

test("realtime voice clips wait during speech, then play after the microphone pause", async () => {
	const f = fixture(); await f.start(); await f.advance(100, .05)
	f.captures[1].onClip(new Blob(["Japanese speech"]))
	assert.equal(f.conversation.player.plays.length, 0)
	await f.advance(899)
	assert.equal(f.conversation.player.plays.length, 0)
	await f.advance(101)
	assert.match(f.conversation.player.src, /^blob:/)
	assert.equal(f.conversation.player.paused, false)
	f.conversation.stop()
})

test("human speech does not interrupt the phone; finished clips release their object URLs", async () => {
	const f = fixture(); await f.start(); f.captures[1].onClip(new Blob(["speech"]))
	const src = f.conversation.player.src
	await f.advance(100, .05)
	assert.equal(f.conversation.player.paused, false)
	await f.advance(1000)
	assert.equal(f.conversation.player.src, src)
	assert.equal(f.conversation.player.paused, false)
	f.conversation.player.onended()
	assert.ok(f.revoked.includes(src))
	f.conversation.stop()
})

test("original and translated captions stream together and late source text updates the same entry", async () => {
	const f = fixture(); await f.start()
	const emit = (type, delta, elapsed_ms) => f.clients[1].options.onTranscript({ event: { type, delta, elapsed_ms } })
	emit("session.output_transcript.delta", "こんにちは", 2000)
	emit("session.input_transcript.delta", "Hello", 1800)
	emit("session.input_transcript.delta", "!", 1800)
	assert.equal(f.turns[0].id, f.turns[1].id)
	assert.equal(f.turns[1].sourceLanguage, "en")
	assert.equal(f.turns[1].targetLanguage, "ja")
	assert.equal(f.turns.at(-1).source, "Hello!")
	assert.equal(f.turns[1].translation, "こんにちは")
	emit("session.input_transcript.delta", "Thank you", 6000)
	emit("session.output_transcript.delta", "ありがとう", 6200)
	assert.notEqual(f.turns.at(-1).id, f.turns[0].id)
	f.conversation.stop()
})

test("Stop ignores late clips and captions, and clears queued voice", async () => {
	const f = fixture(); await f.start(); await f.advance(100, .05)
	f.captures[0].onClip(new Blob(["speech"]))
	f.conversation.stop()
	f.captures[1].onClip(new Blob(["late speech"]))
	f.clients[1].options.onTranscript({ event: { type: "session.output_transcript.delta", delta: "late" } })
	assert.equal(f.conversation.player.plays.length, 0)
	assert.equal(f.turns.length, 0)
	assert.equal(f.revoked.length, 1)
})

test("Stop during microphone permission releases the late stream", async () => {
	let complete
	const microphone = new Promise(resolve => {
		complete = resolve
	})
	const f = fixture({ microphone }); const start = f.start(); f.conversation.stop(); complete(f.stream); await start
	assert.equal(f.track.stopped, true)
	assert.equal(f.clients.length, 0)
})

test("failure in either realtime direction releases both peers and capture", async () => {
	const f = fixture(); await f.start()
	f.clients[0].options.onStatus("error", "Connection lost")
	assert.equal(f.conversation.current, null)
	assert.ok(f.clients.every(client => client.stopped))
	assert.equal(f.statuses.at(-1).message, "Connection lost")
})

test("mute prevents queued voice but leaves streaming captions active", async () => {
	const f = fixture(); await f.start(); f.conversation.setMuted(true)
	f.captures[1].onClip(new Blob(["muted speech"]))
	f.clients[1].options.onTranscript({ event: { type: "session.output_transcript.delta", delta: "こんにちは", elapsed_ms: 0 } })
	assert.equal(f.conversation.player.plays.length, 0)
	assert.equal(f.turns.length, 1)
	assert.ok(f.captures.every(capture => capture.muted))
	f.conversation.stop()
})

test("only supported, different language pairs can start", async () => {
	const f = fixture()
	await assert.rejects(f.conversation.start({ languages: ["en", "en"] }), /different/)
	await assert.rejects(f.conversation.start({ languages: ["en", "no"] }), /supported/)
})

test("backend translates into the other selected language and returns actual MP3 bytes", async () => {
	for (const sourceLanguage of ["en", "ja", "zh"]) {
		const languages = sourceLanguage == "zh" ? ["en", "zh"] : ["en", "ja"]
		const route = {}; const requests = []
		load("backend/http/endpoints/ConversationTurnEndpoint.js", {
			...base, UnsecureRoute: route, Secrets: { openAiToken: "private" }, Buffer,
			fetch: async (url, options) => {
				requests.push({ url, body: JSON.parse(options.body) })
				return { ok: true, json: async () => ({ output: [{ content: [{ type: "output_text", text: JSON.stringify({ sourceLanguage, translation: "translated phrase" }) }] }] }), arrayBuffer: async () => Buffer.from("mp3 audio") }
			},
		}, "UnsecureRoute")
		const result = await route.translateConversationTurn({ body: { text: "spoken phrase", languages }, userId: "user" })
		assert.equal(result.targetLanguage, sourceLanguage == "en" ? "ja" : "en")
		assert.equal(Buffer.from(result.audio, "base64").toString(), "mp3 audio")
		assert.equal(requests[1].body.input, "translated phrase")
		assert.equal(requests[1].body.response_format, "mp3")
		await assert.rejects(route.translateConversationTurn({ body: { text: "phrase", languages: ["en", "no"] }, userId: "user" }), /supported/)
	}
})

function captureFixture() {
	let level = 0
	const clips = []
	const recorders = []
	const sinks = []
	const nodes = []
	const destinationTrack = { stop() {
		this.stopped = true
	} }
	const node = () => {
		const value = { connect() {}, disconnect() {
			this.disconnected = true
		} }; nodes.push(value); return value
	}
	const context = {
		createMediaStreamSource: node,
		createAnalyser: () => Object.assign(node(), { getFloatTimeDomainData: samples => samples.fill(level) }),
		createDelay: () => Object.assign(node(), { delayTime: {} }),
		createMediaStreamDestination: () => Object.assign(node(), { stream: { getTracks: () => [destinationTrack] } }),
	}
	class Sink {
		constructor() {
			sinks.push(this)
		}

		async play() {
			this.played = true
		}

		pause() {
			this.paused = true
		}
	}
	class Recorder {
		static isTypeSupported() {
			return true
		}

		mimeType = "audio/webm"
		state = "inactive"
		constructor() {
			recorders.push(this)
		}

		start() {
			this.state = "recording"
		}

		stop() {
			this.state = "inactive"
			this.ondataavailable({ data: new Blob(["independent voice clip"], { type: this.mimeType }) })
			this.onstop()
		}
	}
	const capture = load("frontend/apps/Google_Translate/CaptureTranslationVoice.js", { ...base, Audio: Sink, MediaRecorder: Recorder }, "CaptureTranslationVoice")(
		context, {}, blob => clips.push(blob), message => {
			throw new Error(message)
		}, () => {},
	)
	return { capture, clips, recorders, sinks, nodes, destinationTrack, level: value => {
		level = value
	} }
}

test("native capture makes independent short voice clips and flushes the tail after silence", async () => {
	const f = captureFixture()
	f.level(.03); f.capture.poll(100)
	assert.equal(f.recorders.length, 1)
	assert.equal(f.clips.length, 0)
	f.capture.poll(2100)
	assert.equal(f.clips.length, 1)
	assert.equal(f.recorders.length, 2)
	f.level(0); f.capture.poll(2600)
	assert.equal(f.clips.length, 2)
	assert.equal(f.clips[0].type, "audio/webm")
	assert.equal(await f.clips[1].text(), "independent voice clip")
	assert.ok(f.sinks[0].muted && f.sinks[0].played)
	f.capture.stop()
	assert.ok(f.nodes.every(node => node.disconnected))
	assert.equal(f.destinationTrack.stopped, true)
	assert.equal(f.sinks[0].srcObject, null)
})

test("capture discards muted speech and stops emitting clips after cleanup", () => {
	const f = captureFixture()
	f.level(.03); f.capture.poll(100)
	f.capture.setMuted(true)
	f.capture.poll(2300)
	assert.equal(f.clips.length, 0)
	f.capture.setMuted(false); f.capture.poll(2400)
	f.capture.stop(); f.capture.poll(5000)
	assert.equal(f.clips.length, 0)
})

test("realtime remote callback uses an explicit function check with the real condition rules", async () => {
	const peers = []
	class Peer {
		constructor() {
			peers.push(this)
		}

		addTrack() {}
		createDataChannel() {
			return { close() {} }
		}

		async createOffer() {
			return { sdp: "offer" }
		}

		async setLocalDescription() {}
		async setRemoteDescription() {}
		close() {}
	}
	const remote = {}
	const received = []
	const Client = load("frontend/tools/ai/openai/RealTimeTranslate.js", {
		...base, RTCPeerConnection: Peer,
		Audio: class {
			pause() {}
		},
		navigator: { mediaDevices: { getUserMedia() {} } }, Config: { httpUrl: "backend" }, Token: { encodedToken: "token" },
		fetch: async () => ({ ok: true, json: async () => ({ value: "ephemeral" }), text: async () => "answer" }),
	}, "RealTimeTranslate")
	const client = new Client()
	await client.start({ stream: { getTracks: () => [{}] }, onAudioStream: stream => received.push(stream) })
	peers[0].ontrack({ streams: [remote] })
	assert.deepEqual(received, [remote])
	client.stop()
})

test("same-language output is filtered from both playback and conversation captions", async () => {
	const f = fixture(); await f.start()
	f.clients[0].options.onTranscript({ event: { type: "session.output_transcript.delta", delta: "Hello", elapsed_ms: 0 } })
	f.clients[1].options.onTranscript({ event: { type: "session.output_transcript.delta", delta: "こんにちは", elapsed_ms: 0 } })
	f.captures[0].onClip(new Blob(["English echo"]))
	f.captures[1].onClip(new Blob(["Japanese translation"]))
	assert.equal(f.turns.length, 1)
	assert.equal(f.turns[0].targetLanguage, "ja")
	assert.equal(f.conversation.player.plays.length, 1)
	f.conversation.stop()
})

test("script detection recognizes supported language pairs without another API request", () => {
	const detect = load("frontend/apps/Google_Translate/DetectConversationLanguage.js", base, "DetectConversationLanguage")
	assert.equal(detect("Hello there", ["en", "ja"]), "en")
	assert.equal(detect("こんにちは", ["en", "ja"]), "ja")
	assert.equal(detect("你好", ["en", "zh"]), "zh")
	assert.equal(detect("東京", ["en", "ja"]), "ja")
	assert.equal(detect("...", ["en", "ja"]), null)
})

test("manual recording holds translated voice through silence until Stop recording", async () => {
	const f = fixture(); await f.start({ manual: true })
	assert.equal(f.track.enabled, true)
	f.captures[1].onClip(new Blob(["Japanese speech"]))
	await f.advance(5000)
	assert.equal(f.conversation.player.plays.length, 0)
	f.conversation.stopRecording()
	assert.equal(f.track.enabled, false)
	assert.equal(f.conversation.player.paused, false)
	assert.equal(f.conversation.player.plays.length, 1)
	f.conversation.stop()
})

test("manual recording restarts on the same connections without interrupting phone playback", async () => {
	const f = fixture(); await f.start({ manual: true })
	f.captures[1].onClip(new Blob(["Japanese speech"]))
	f.conversation.stopRecording()
	f.conversation.startRecording()
	assert.equal(f.track.enabled, true)
	assert.equal(f.conversation.player.paused, false)
	assert.equal(f.clients.length, 2)
	await f.advance(5000)
	assert.equal(f.conversation.player.paused, false)
	f.conversation.stopRecording()
	assert.equal(f.conversation.player.paused, false)
	f.conversation.stop()
})

test("queued continuation clips finish during human speech, including while the next clip encodes", async () => {
	const f = fixture(); await f.start()
	f.captures[1].pendingAudio = true
	f.captures[1].onClip(new Blob(["first part"]))
	await f.advance(100, .05)
	f.conversation.player.paused = true
	f.conversation.player.onended()
	await f.advance(100, .05)
	assert.equal(f.conversation.current.draining, true)
	f.captures[1].onClip(new Blob(["continuation"]))
	assert.equal(f.conversation.player.paused, false)
	assert.equal(f.conversation.player.plays.length, 2)
	f.captures[1].pendingAudio = false
	f.conversation.player.paused = true
	f.conversation.player.onended()
	assert.equal(f.conversation.current.draining, false)
	f.captures[1].onClip(new Blob(["new response"]))
	assert.equal(f.conversation.player.plays.length, 2)
	await f.advance(1000)
	assert.equal(f.conversation.player.plays.length, 3)
	f.conversation.stop()
})

test("a short Japanese reply overrides a long earlier English sentence in script detection", () => {
	const detect = load("frontend/apps/Google_Translate/DetectConversationLanguage.js", base, "DetectConversationLanguage")
	const english = "Hello, I would like to order a cup of coffee, thank you very much. "
	assert.equal(detect(english + "はい", ["en", "ja"]), "ja")
	assert.equal(detect(english + "ありがとうございます", ["en", "ja"]), "ja")
	assert.equal(detect("ありがとうございます。 Yes", ["en", "ja"]), "en")
})

test("quick English to Japanese and back creates independent source turns", async () => {
	const f = fixture(); await f.start()
	const emit = (type, delta, elapsed_ms) => f.clients[0].options.onTranscript({ event: { type, delta, elapsed_ms } })
	emit("session.input_transcript.delta", " I would like to order a cup of coffee, thank you very much.", 1000)
	emit("session.input_transcript.delta", "はい", 1200)
	emit("session.output_transcript.delta", "Yes", 1400)
	assert.equal(f.turns.at(-1).sourceLanguage, "ja")
	assert.equal(f.turns.at(-1).source, "はい")
	assert.equal(f.turns.at(-1).translation, "Yes")
	f.captures[0].onClip(new Blob(["English reply"]))
	assert.equal(f.conversation.player.plays.length, 1)
	const first = f.turns.at(-1).id
	emit("session.input_transcript.delta", "ありがとう", 1400)
	assert.equal(f.turns.at(-1).source, "はいありがとう")
	assert.equal(f.turns.at(-1).id, first)
	f.clients[1].options.onTranscript({ event: { type: "session.input_transcript.delta", delta: "はい", elapsed_ms: 1200 } })
	f.clients[1].options.onTranscript({ event: { type: "session.input_transcript.delta", delta: "Thank you", elapsed_ms: 1600 } })
	f.clients[1].options.onTranscript({ event: { type: "session.output_transcript.delta", delta: "ありがとう", elapsed_ms: 1800 } })
	assert.equal(f.turns.at(-1).sourceLanguage, "en")
	assert.equal(f.turns.at(-1).source, "Thank you")
	f.conversation.stop()
})

test("English output arriving before a short Japanese source caption is reattached to that reply", async () => {
	const f = fixture(); await f.start()
	const emit = (type, delta, elapsed_ms) => f.clients[0].options.onTranscript({ event: { type, delta, elapsed_ms } })
	emit("session.input_transcript.delta", "Long earlier English sentence", 1000)
	emit("session.output_transcript.delta", "Yes", 1600)
	emit("session.input_transcript.delta", "はい", 1400)
	assert.equal(f.turns.at(-1).source, "はい")
	assert.equal(f.turns.at(-1).translation, "Yes")
	f.captures[0].onClip(new Blob(["English reply"]))
	assert.equal(f.conversation.player.paused, false)
	f.conversation.stop()
})

test("missing source captions cannot block valid voice or later clips", async () => {
	const f = fixture(); await f.start()
	f.clients[0].options.onTranscript({ event: { type: "session.output_transcript.delta", delta: "Yes", elapsed_ms: 6000 } })
	f.captures[0].onClip(new Blob(["English reply, source late"]))
	assert.equal(f.conversation.player.plays.length, 1)
	f.conversation.stop()
})

test("audio for a short Japanese reply can play before its source caption arrives", async () => {
	const f = fixture(); await f.start()
	const emit = (type, delta, elapsed_ms) => f.clients[0].options.onTranscript({ event: { type, delta, elapsed_ms } })
	emit("session.input_transcript.delta", "Thank you", 1000)
	emit("session.output_transcript.delta", "Thank you", 1600)
	f.captures[0].onClip(new Blob(["English voice for a Japanese reply"]))
	assert.equal(f.conversation.player.plays.length, 1)
	const src = f.conversation.player.src
	emit("session.input_transcript.delta", "ありがとう", 1400)
	assert.equal(f.turns.at(-1).source, "ありがとう")
	assert.equal(f.turns.at(-1).translation, "Thank you")
	assert.equal(f.conversation.player.src, src)
	assert.equal(f.conversation.player.paused, false)
	f.conversation.stop()
})

test("late English captions cannot change the current Japanese source turn", () => {
	const detect = load("frontend/apps/Google_Translate/DetectConversationLanguage.js", base, "DetectConversationLanguage")
	const update = load("frontend/apps/Google_Translate/UpdateRealtimeCaption.js", { ...base, DetectConversationLanguage: detect }, "UpdateRealtimeCaption")
	const state = { segments: [], latestInput: null }
	let id = 0
	const add = (delta, elapsed_ms) => update(state, { type: "session.input_transcript.delta", delta, elapsed_ms }, () => id++, ["en", "ja"], "en")
	const english = add("Hello", 1000)
	const japanese = add("はい", 1400)
	add(" there", 1200)
	assert.equal(english.source, "Hello there")
	assert.equal(japanese.source, "はい")
	assert.equal(state.latestInput.segment, japanese)
	assert.equal(state.latestInput.language, "ja")
})

test("manual recording does not turn the conversation button into End session", async () => {
	const element = () => ({
		value: "", disabled: false, hidden: false, textContent: "", listeners: {},
		classList: { toggle() {}, contains() {
			return false
		} },
		append() {}, addEventListener(event, callback) {
			this.listeners[event] = callback
		},
		click() {
			if (!this.disabled) {
				this.listeners.click()
			}
		},
	})
	let options
	let starts = 0
	let pauses = 0
	class Conversation {
		stop() {}
		async start(value) {
			options = value; starts++; value.onStatus("listening")
		}

		startRecording() {}
		stopRecording() {
			pauses++
		}
	}
	const file = "frontend/apps/Google_Translate/translate-page.js"
	const source = TranspileContent(file, readFileSync(file, "utf8"), []).replace(/^import .*$/gm, "").replace("export default", "const definition =")
	const globals = { ...base, TranslationConversation: Conversation, document: { createElement: element } }
	const definition = new Function(...Object.keys(globals), source + "\nreturn definition")(...Object.values(globals))
	const html = Object.fromEntries(["firstLanguage", "secondLanguage", "startConversation", "startRecording", "translationStatus", "enableTranslationAudio", "clearTranslations"].map(key => [key, element()]))
	html.fields = definition.fields()
	definition.onFirstDomAdd({ html })
	html.startRecording.click()
	await Promise.resolve()
	assert.equal(html.startRecording.textContent, "Stop recording")
	assert.equal(html.startConversation.textContent, "Start conversation")
	assert.equal(html.startConversation.disabled, true)
	html.startRecording.click()
	assert.equal(pauses, 1)
	assert.equal(html.fields.recording, false)
	assert.equal(html.startRecording.textContent, "Start recording")
	assert.equal(html.startConversation.textContent, "Start conversation")
	assert.equal(html.startConversation.disabled, false)
	assert.match(html.translationStatus.textContent, /Microphone off/)
	html.startConversation.click()
	await Promise.resolve()
	assert.equal(starts, 2)
	assert.equal(options.manual, false)
	assert.equal(html.startConversation.textContent, "End session")
	html.startConversation.click()
	assert.equal(html.fields.running, false)
	assert.equal(html.startConversation.textContent, "Start conversation")
})

test("translation timing cannot pull a later source back into an older language turn", () => {
	const detect = load("frontend/apps/Google_Translate/DetectConversationLanguage.js", base, "DetectConversationLanguage")
	const update = load("frontend/apps/Google_Translate/UpdateRealtimeCaption.js", { ...base, DetectConversationLanguage: detect }, "UpdateRealtimeCaption")
	const state = { segments: [], latestInput: null }
	let id = 0
	const add = (input, delta, elapsed_ms) => update(state, { type: `session.${input ? "input" : "output"}_transcript.delta`, delta, elapsed_ms }, () => id++, ["en", "ja"], "ja")
	const first = add(true, "Hello", 1000)
	add(false, "こんにちは", 2600)
	const japanese = add(true, "はい", 2000)
	const second = add(true, "Thank", 2400)
	add(true, " you", 2600)
	assert.equal(first.source, "Hello")
	assert.equal(japanese.source, "はい")
	assert.equal(second.source, "Thank you")
})

test("late source punctuation belongs to its earlier turn instead of the current speaker", () => {
	const detect = load("frontend/apps/Google_Translate/DetectConversationLanguage.js", base, "DetectConversationLanguage")
	const update = load("frontend/apps/Google_Translate/UpdateRealtimeCaption.js", { ...base, DetectConversationLanguage: detect }, "UpdateRealtimeCaption")
	const state = { segments: [], latestInput: null }
	let id = 0
	const add = (delta, elapsed_ms) => update(state, { type: "session.input_transcript.delta", delta, elapsed_ms }, () => id++, ["en", "ja"], "en")
	const english = add("Hello", 1000)
	const japanese = add("はい", 1200)
	add("!", 1000)
	assert.equal(english.source, "Hello!")
	assert.equal(japanese.source, "はい")
})

test("a new English sentence beginning before its source caption does not bleed into Japanese's translation", () => {
	const detect = load("frontend/apps/Google_Translate/DetectConversationLanguage.js", base, "DetectConversationLanguage")
	const update = load("frontend/apps/Google_Translate/UpdateRealtimeCaption.js", { ...base, DetectConversationLanguage: detect }, "UpdateRealtimeCaption")
	const state = { segments: [], latestInput: null }
	let id = 0
	const add = (input, delta, elapsed_ms) => update(state, { type: `session.${input ? "input" : "output"}_transcript.delta`, delta, elapsed_ms }, () => id++, ["en", "ja"], "en")
	const japanese = add(true, "ありがとう", 1000)
	add(false, "Thank you", 1400)
	add(false, ".", 1800)
	add(false, " Hello", 1800)
	add(false, ",", 2000)
	const english = add(true, " Hello", 2200)
	assert.equal(japanese.translation, "Thank you.")
	assert.equal(english.translation, " Hello,")
	add(true, " there", 2400)
	add(false, " there", 2600)
	assert.equal(japanese.translation, "Thank you.")
	assert.equal(english.source, " Hello there")
	assert.equal(english.translation, " Hello, there")
})

test("ongoing translated output stays together after source speech has ended", () => {
	const detect = load("frontend/apps/Google_Translate/DetectConversationLanguage.js", base, "DetectConversationLanguage")
	const update = load("frontend/apps/Google_Translate/UpdateRealtimeCaption.js", { ...base, DetectConversationLanguage: detect }, "UpdateRealtimeCaption")
	const state = { segments: [], latestInput: null }
	let id = 0
	const add = (input, delta, elapsed_ms) => update(state, { type: `session.${input ? "input" : "output"}_transcript.delta`, delta, elapsed_ms }, () => id++, ["en", "ja"], "en")
	const source = add(true, "ありがとうございます", 1000)
	add(false, "Thank", 1800)
	add(false, " you", 2600)
	add(false, " very", 3400)
	add(false, " much.", 4200)
	assert.equal(source.translation, "Thank you very much.")
	assert.equal(state.segments.length, 1)
})

test("late same-language source removes the provisional translation row", async () => {
	const f = fixture(); await f.start()
	const emit = (type, delta, elapsed_ms) => f.clients[0].options.onTranscript({ event: { type, delta, elapsed_ms } })
	emit("session.output_transcript.delta", "Hello", 6000)
	const provisional = f.turns.at(-1)
	assert.equal(provisional.sourceLanguage, "ja")
	emit("session.input_transcript.delta", "Hello", 5800)
	assert.deepEqual(f.turns.at(-1), { id: provisional.id, removed: true })
	f.conversation.stop()
})

test("moving a new English sentence refreshes the already displayed Japanese row", async () => {
	const f = fixture(); await f.start()
	const emit = (type, delta, elapsed_ms) => f.clients[0].options.onTranscript({ event: { type, delta, elapsed_ms } })
	emit("session.input_transcript.delta", "ありがとう", 1000)
	emit("session.output_transcript.delta", "Thank you", 1400)
	emit("session.output_transcript.delta", ".", 1800)
	emit("session.output_transcript.delta", " Hello", 1800)
	const row = f.turns.at(-1)
	assert.equal(row.translation, "Thank you. Hello")
	emit("session.input_transcript.delta", " Hello", 2200)
	const corrected = f.turns.filter(turn => turn.id == row.id).at(-1)
	assert.equal(corrected.source, "ありがとう")
	assert.equal(corrected.translation, "Thank you.")
	f.conversation.stop()
})
