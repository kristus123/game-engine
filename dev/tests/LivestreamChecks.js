import assert from "node:assert/strict"
import { test } from "node:test"
import { readFileSync } from "node:fs"
import { EventEmitter } from "node:events"
import { TranspileContent } from "../transpiler/TranspileContent.js"

function load(relativePath, name, dependencies = {}) {
	const file = new URL("../../" + relativePath, import.meta.url)
	const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), [])
	const runtime = {
		SuperClass: class {},
		IfCondition: { validate: Boolean },
		Assert: {
			notNull: value => assert.ok(value != null),
			true: value => assert.equal(value, true),
			value: value => {
				assert.ok(value); return value
			},
		},
		...dependencies,
	}
	return new Function(...Object.keys(runtime), source.replace("export ", "") + `\nreturn ${name}`)(...Object.values(runtime))
}

function broadcastFixture() {
	let now = 100_000
	let writes = 0
	let starts = 0
	let stops = 0
	const Ffmpeg = {
		p: null,
		start: async () => {
			starts++
			const p = new EventEmitter()
			p.exitCode = null
			p.signalCode = null
			Ffmpeg.p = { p }
		},
		stop: async () => {
			stops++
			Ffmpeg.p.p.exitCode = 0
			Ffmpeg.p.p.emit("exit")
			Ffmpeg.p = null
		},
		write: async () => {
			writes++
		},
	}
	const Broadcast = load("backend/http/endpoints/hls/HlsBroadcast.js", "HlsBroadcast", {
		Ffmpeg,
		Files: { deleteFilesInFolder: () => {} },
		Config: { streamStallMs: 8_000, streamReconnectMs: 52_000 },
		Date: { now: () => now },
	})
	const identity = { revision: 1, userId: "22222222-2222-2222-2222-222222222222", mimeType: "webm" }
	const write = (sequence = 0, ids = identity) => Broadcast.write({ ...ids, sequence }, Buffer.from("media"))
	return { Broadcast, Ffmpeg, identity, write, advance: ms => {
		now += ms
	}, counts: () => ({ starts, stops, writes }) }
}

test("missing media shows reconnecting after detection, then expires at 52 seconds without a viewer", async () => {
	const f = broadcastFixture()
	await f.Broadcast.start(f.identity)
	await f.write()
	assert.equal(f.Broadcast.status().state, "live")
	f.advance(8_000)
	assert.equal(f.Broadcast.status().state, "reconnecting")
	assert.equal(f.Broadcast.status().remainingMs, 52_000)
	f.advance(51_999)
	await f.Broadcast.expire()
	assert.equal(f.Broadcast.status().state, "reconnecting")
	f.advance(1)
	await f.Broadcast.expire()
	assert.equal(f.Broadcast.status().state, "offline")
	assert.equal(f.counts().stops, 1)
	assert.equal((await f.Broadcast.start({ ...f.identity, resume: true })).expired, true)
})

test("media recovery renews the deadline; repeated start requests and duplicate chunks do not", async () => {
	const f = broadcastFixture()
	await f.Broadcast.start(f.identity)
	await f.write()
	f.advance(20_000)
	await f.Broadcast.start(f.identity)
	await f.write()
	assert.equal(f.Broadcast.status().remainingMs, 40_000)
	assert.equal(f.counts().starts, 1)
	assert.equal(f.counts().writes, 1)
	await f.write(1)
	assert.equal(f.Broadcast.status().state, "live")
	assert.equal(f.Broadcast.status().remainingMs, 60_000)
})

test("resuming starts a new encoder and rejects stale uploads, gaps, and another broadcaster", async () => {
	const f = broadcastFixture()
	await f.Broadcast.start(f.identity)
	await f.write()
	f.advance(20_000)
	const next = { ...f.identity, revision: 2, resume: true }
	await f.Broadcast.start(next)
	assert.equal(f.Broadcast.status().state, "reconnecting")
	assert.equal((await f.write(1)).accepted, false)
	assert.equal((await f.write(1, next)).accepted, false)
	assert.equal((await f.write(0, next)).accepted, true)
	assert.equal(f.Broadcast.status().state, "live")
	assert.equal((await f.Broadcast.start({ ...next, userId: "44444444-4444-4444-4444-444444444444", resume: false })).accepted, false)
	assert.equal((await f.Broadcast.stop("wrong-session", f.identity.userId)).accepted, false)
	assert.deepEqual(f.counts(), { starts: 2, stops: 1, writes: 2 })
})

test("encoder death enters reconnecting and a late upload cannot revive an expired stream", async () => {
	const f = broadcastFixture()
	await f.Broadcast.start(f.identity)
	await f.write()
	f.Ffmpeg.p.p.exitCode = 1
	f.Ffmpeg.p.p.emit("exit")
	assert.equal(f.Broadcast.status().state, "reconnecting")
	f.advance(52_000)
	assert.equal((await f.write(1)).expired, true)
	assert.equal(f.Broadcast.status().state, "offline")
})

test("failed queued work rejects its caller while allowing later work", async () => {
	const Queue = load("frontend/tools/utils/queue/PromiseQueue.js", "PromiseQueue")
	const queue = new Queue()
	await assert.rejects(queue.add(async () => {
		throw new Error("upload failed")
	}), /upload failed/)
	assert.equal(await queue.add(async () => 42), 42)
})

test("timeout loop starts automatically, supports initial stop and stops after an in-flight callback", async () => {
	const loop = load("frontend/tools/utils/helpers/SetTimeoutLoop.js", "SetTimeoutLoop")
	let calls = 0
	let finish
	const controller = loop(10, () => {
		calls++
		return new Promise(resolve => {
			finish = resolve
		})
	}).stop()
	await new Promise(resolve => setTimeout(resolve, 20))
	assert.equal(calls, 0)
	controller.start()
	await new Promise(resolve => setTimeout(resolve, 0))
	assert.equal(calls, 1)
	controller.stop()
	finish()
	await new Promise(resolve => setTimeout(resolve, 20))
	assert.equal(calls, 1)
})

function publisherFixture(savedBroadcast = { value: "null" }) {
	const requests = []
	let failStop = false
	let stopReply = async () => ({ accepted: true })
	let statusReply = async () => ({ online: false, state: "offline", playbackId: null })
	let stopCalls = 0
	let startReply = async () => ({ accepted: true })
	const recorder = { active: false, options: null, v2Start: (_onBlob, _onError, options) => {
		recorder.options = options
		recorder.active = true
		return { get active() {
			return recorder.active
		}, stop: () => {
			recorder.active = false
		} }
	} }
	const result = body => ({ ok: true, body })
	const Stream = load("frontend/apps/livestream/livestream_streamer/media/Stream.js", "Stream", {
		LocalValue: () => savedBroadcast,
		Assert: {
			notNull: value => assert.ok(value != null),
			true: value => assert.equal(value, true),
			ok: response => {
				assert.equal(response.ok, true); return response.body
			},
		},
		Network: { offline: false, onOffline: () => {} },
		Config: { streamStallMs: 8_000 },
		Platform: { mimeType: "video/webm" },
		Token: { userId: "22222222-2222-2222-2222-222222222222" },
		SetTimeoutLoop: () => ({}),
		MediaRecorder: recorder,
		SoundContext: { resume: async () => {} },
		SwappableMediaStream: { prepare: async () => {}, mediaStream: {}, videoDeviceId: null, audioDeviceId: null, video: { srcObject: null }, audioContext: { resume: async () => {} } },
		JsonHttpClient: {
			startStream: async ({ body }) => {
				requests.push(body); return result(await startReply())
			},
			stopStream: async () => {
				stopCalls++
				if (failStop) {
					throw new Error("offline")
				}
				return result(await stopReply())
			},
			streamOnline: async () => result(await statusReply()),
		},
	})
	return { Stream, recorder, requests, get stopCalls() {
		return stopCalls
	}, failStop: value => {
		failStop = value
	}, startReply: reply => {
		startReply = reply
	}, stopReply: reply => {
		stopReply = reply
	}, statusReply: reply => {
		statusReply = reply
	} }
}

test("an in-flight upload gets its retry window before stall recovery starts", async () => {
	const f = publisherFixture()
	await f.Stream.start()
	const revision = f.Stream.broadcast.revision
	f.Stream.lastUploadAt = Date.now() - 9_000
	f.Stream.uploadsInFlight = 1
	await f.Stream.maintain()
	assert.equal(f.Stream.broadcast.revision, revision)
	assert.equal(f.recorder.active, true)
	f.Stream.uploadsInFlight = 0
})

test("publisher resumes after interruption and retries an offline stop until it succeeds", async () => {
	const f = publisherFixture()
	await f.Stream.start()
	assert.equal(f.recorder.active, true)
	const firstId = f.Stream.broadcast.revision
	f.Stream.interrupt()
	await f.Stream.maintain()
	assert.equal(f.recorder.active, true)
	assert.notEqual(f.Stream.broadcast.revision, firstId)
	assert.equal(f.requests[1].resume, true)
	f.failStop(true)
	await f.Stream.stop()
	assert.equal(f.Stream.state, "stopping")
	assert.equal(f.recorder.active, false)
	assert.equal(f.Stream.broadcast.stopping, true)
	f.failStop(false)
	await f.Stream.maintain()
	assert.equal(f.Stream.broadcast, null)
})

test("a rejected stop only clears local state after status confirms the old session is gone", async () => {
	const f = publisherFixture()
	await f.Stream.start()
	f.stopReply(async () => ({ accepted: false, expired: true }))
	f.statusReply(async () => ({ online: true, state: "live", playbackId: "22222222-2222-2222-2222-222222222222-999" }))
	await f.Stream.stop()
	assert.equal(f.Stream.broadcast, null)
	assert.equal(f.Stream.state, "busy")
})

test("stopping a rejected current session retains it for retry", async () => {
	const f = publisherFixture()
	await f.Stream.start()
	f.stopReply(async () => ({ accepted: false, expired: false }))
	f.statusReply(async () => ({ online: false, state: "reconnecting", playbackId: `22222222-2222-2222-2222-222222222222-${f.Stream.broadcast.revision}` }))
	await f.Stream.stop()
	assert.equal(f.Stream.broadcast.stopping, true)
	assert.equal(f.Stream.state, "stopping")
})

test("livestream uses the standard recorder bitrate", async () => {
	const f = publisherFixture()
	await f.Stream.start()
	assert.equal(f.recorder.options.videoBitsPerSecond, 1_800_000)
	assert.equal(f.recorder.options.audioBitsPerSecond, 64_000)
})

test("an expired resume ends locally and stopping during start cannot restart the recorder", async () => {
	const f = publisherFixture()
	await f.Stream.start()
	f.Stream.interrupt()
	f.startReply(async () => ({ accepted: false, expired: true }))
	await f.Stream.maintain()
	assert.equal(f.Stream.state, "ended")
	assert.equal(f.Stream.broadcast, null)
	let finish
	f.startReply(() => new Promise(resolve => {
		finish = resolve
	}))
	const starting = f.Stream.start()
	await new Promise(resolve => setTimeout(resolve, 0))
	const stopping = f.Stream.stop()
	await Promise.resolve()
	assert.equal(f.stopCalls, 0)
	finish({ accepted: true })
	await Promise.all([starting, stopping])
	assert.equal(f.stopCalls, 1)
	assert.equal(f.recorder.active, false)
	assert.equal(f.Stream.broadcast, null)
})

test("broadcast operations enforce the token user ID even with valid session identifiers", async () => {
	const f = broadcastFixture()
	await f.Broadcast.start(f.identity)
	const other = { ...f.identity, userId: "44444444-4444-4444-4444-444444444444" }
	assert.equal((await f.write(0, other)).accepted, false)
	assert.equal((await f.Broadcast.stop(f.identity.revision, other.userId)).accepted, false)
	assert.equal((await f.Broadcast.start({ ...other, resume: true })).accepted, false)
	assert.equal(f.Broadcast.status().state, "starting")
	assert.equal((await f.write()).accepted, true)
})

test("the viewer can be constructed when native HLS may be available", () => {
	const Video = load("frontend/apps/livestream/livestream_viewer/HLS/HlsVideo.js", "HlsVideo", {
		HlsJs: { supported: false },
		Assert: { notNull: value => assert.ok(value != null), true: value => assert.equal(value, true) },
		Config: { httpUrl: "http://localhost:3000" },
		Permission: { canPlayAudio: true },
		H: { hlsVideo: () => ({ addEventListener() {}, removeAttribute() {}, load() {}, pause() {} }) },
	})
	assert.doesNotThrow(() => new Video())
})

test("replacing an encoder early does not shorten or extend the media deadline", async () => {
	const f = broadcastFixture()
	await f.Broadcast.start(f.identity)
	await f.write()
	f.advance(2_000)
	await f.Broadcast.start({ ...f.identity, revision: 2, resume: true })
	assert.equal(f.Broadcast.status().remainingMs, 58_000)
})

function mediaFixture({ noDefaultMicrophone = false } = {}) {
	const requests = []
	const track = (kind, deviceId) => ({ kind, stop() {}, getSettings: () => ({ deviceId }) })
	class Tracks {
		constructor(tracks) {
			this.tracks = tracks; this.active = true
		}

		getTracks() {
			return this.tracks
		}

		getAudioTracks() {
			return this.tracks.filter(t => t.kind == "audio")
		}

		getVideoTracks() {
			return this.tracks.filter(t => t.kind == "video")
		}
	}
	const node = () => ({ connect() {}, disconnect() {} })
	class FakeAudioContext {
		resume = async () => {}
		createMediaStreamDestination() {
			return { stream: new Tracks([track("audio", "mixed")]) }
		}

		createMediaStreamSource() {
			return node()
		}
	}
	const soundContext = {
		get context() {
			return this._context ??= new FakeAudioContext()
		},
		resume: async () => soundContext.context.resume(),
		createMediaStreamDestination: () => soundContext.context.createMediaStreamDestination(),
		createMediaStreamSource: stream => soundContext.context.createMediaStreamSource(stream),
	}
	const Media = load("frontend/apps/livestream/livestream_streamer/media/SwappableMediaStream.js", "SwappableMediaStream", {
		Assert: {
			notNull: value => assert.ok(value != null),
			true: value => assert.equal(value, true),
			value: value => {
				assert.ok(value); return value
			},
		},
		SetTimeoutLoop: () => {},
		H: {
			mediastreamVideo: () => ({ srcObject: null, play: async () => {} }),
			CanvasWithStream: () => ({ ctx: { fillRect() {} }, canvas: { width: 1280, height: 720 }, canvasStream: new Tracks([track("video", "canvas")]) }),
		},
		MediaStream: Tracks,
		SoundContext: soundContext,
		AudioTrack: () => ({ input: node(), apply() {
			return this
		}, routeTo() {
			return this
		} }),
		Vst: { compressor: () => node() },
		AudioContext: FakeAudioContext,
		Permission: { request: async () => {} },
		MediaDevices: {
			audio: async id => {
				requests.push(["audio", id])
				if (id == "missing-mic" || (noDefaultMicrophone && id == null)) {
					throw new Error("device not found")
				}
				return new Tracks([track("audio", id ?? "default-mic")])
			},
			video: async id => {
				requests.push(["video", id])
				if (id == "missing-camera") {
					throw new Error("device not found")
				}
				return new Tracks([track("video", id ?? "default-camera")])
			},
		},
	})
	return { Media, requests }
}

test("media preparation opens defaults once and preserves explicit device selections", async () => {
	const { Media, requests } = mediaFixture()
	await Media.prepare()
	assert.deepEqual(requests, [["audio", undefined], ["video", undefined]])
	assert.equal(Media.audioDeviceId, "default-mic")
	assert.equal(Media.videoDeviceId, "default-camera")
	await Media.prepare()
	assert.equal(requests.length, 2)
	await Media.setAudioDevice("chosen-mic")
	await Media.swapVideo("chosen-camera")
	await Media.prepare()
	assert.equal(Media.audioDeviceId, "chosen-mic")
	assert.equal(Media.videoDeviceId, "chosen-camera")
	assert.equal(requests.length, 4)
})

test("missing saved devices fall back to the defaults", async () => {
	const { Media, requests } = mediaFixture()
	await Media.prepare({ audioDeviceId: "missing-mic", videoDeviceId: "missing-camera" })
	assert.deepEqual(requests, [
		["audio", "missing-mic"],
		["audio", undefined],
		["video", "missing-camera"],
		["video", undefined],
	])
	assert.equal(Media.audioDeviceId, "default-mic")
	assert.equal(Media.videoDeviceId, "default-camera")
})

test("missing selected and default microphones throw an error", async () => {
	const { Media, requests } = mediaFixture({ noDefaultMicrophone: true })
	await assert.rejects(Media.prepare({ audioDeviceId: "missing-mic" }), /No microphone is available/)
	assert.deepEqual(requests, [["audio", "missing-mic"], ["audio", undefined]])
})

test("default device requests omit exact device constraints", async () => {
	const requests = []
	const Devices = load("frontend/tools/core/os/devices/MediaDevices.js", "MediaDevices", {
		Assert: { notNull: value => assert.ok(value != null), true: value => assert.equal(value, true) },
		Permission: { granted: true },
		navigator: { mediaDevices: { getUserMedia: async constraints => {
			requests.push(constraints); return {}
		} } },
	})
	await Devices.audio()
	await Devices.video()
	assert.equal(Object.hasOwn(requests[0].audio, "deviceId"), false)
	assert.equal(Object.hasOwn(requests[1].video, "deviceId"), false)
	await Devices.audio("selected")
	assert.deepEqual(requests[2].audio.deviceId, { exact: "selected" })
})

test("stopping while the recorder opens default devices cancels recording", async () => {
	let finish
	let recorders = 0
	const MediaRecorderApi = class {
		constructor() {
			recorders++
			this.state = "recording"
		}

		start() {}
		stop() {
			this.state = "inactive"; this.onstop?.()
		}
	}
	const Enhancer = load("frontend/tools/core/media_recorder/Enhance_MediaRecorder.js", "Enhance_MediaRecorder", {
		NativeEnhancer: class {
			constructor(target) {
				for (const name of Object.getOwnPropertyNames(this.constructor.prototype).filter(name => name != "constructor")) {
					Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(this.constructor.prototype, name))
				}
			}
		},
		MediaRecorder: MediaRecorderApi,
		PromiseQueue: () => ({ add: callback => Promise.resolve().then(callback) }),
		SwappableMediaStream: { prepare: () => new Promise(resolve => {
			finish = resolve
		}), stream: {} },
		Platform: { mimeType: "video/webm" },
		Config: { hlsTime: 1 },
	})
	new Enhancer()
	const starting = MediaRecorderApi.v2Start(() => {}, () => {})
	starting.stop()
	finish()
	await new Promise(resolve => setTimeout(resolve, 0))
	assert.equal(recorders, 0)
})

test("reload restores a broadcast and resumes with a fresh revision", async () => {
	const saved = { value: "null" }
	const first = publisherFixture(saved)
	await first.Stream.start()
	const revision = first.Stream.broadcast.revision
	const restored = publisherFixture(saved)
	restored.Stream.init()
	assert.equal(restored.Stream.broadcast.revision, revision)
	await restored.Stream.maintain()
	assert.ok(restored.Stream.broadcast.revision > revision)
	assert.equal(restored.requests[0].resume, true)
	assert.equal(restored.recorder.active, true)
})

test("offline stop survives reload and is retried without restarting recording", async () => {
	const saved = { value: "null" }
	const first = publisherFixture(saved)
	await first.Stream.start()
	first.failStop(true)
	await first.Stream.stop()
	const restored = publisherFixture(saved)
	restored.Stream.init()
	await restored.Stream.maintain()
	assert.equal(restored.stopCalls, 1)
	assert.equal(restored.requests.length, 0)
	assert.equal(restored.Stream.broadcast, null)
	assert.equal(saved.value, "null")
})

test("a saved session belonging to another identity is not resumed", () => {
	const f = publisherFixture({ value: JSON.stringify({ revision: 1, userId: "another-user" }) })
	f.Stream.init()
	assert.equal(f.Stream.broadcast, null)
})

test("autoplay rejection falls back to muted playback and offers audio activation", async () => {
	let callbacks
	let plays = 0
	let blocked = 0
	const video = {
		muted: false,
		play: async () => {
			if (++plays == 1) {
				throw Object.assign(new Error("gesture required"), { name: "NotAllowedError" })
			}
		},
		pause() {}, load() {}, removeAttribute() {},
	}
	const Video = load("frontend/apps/livestream/livestream_viewer/HLS/HlsVideo.js", "HlsVideo", {
		Config: { httpUrl: "http://localhost:3000" },
		Permission: { canPlayAudio: true },
		H: { hlsVideo: () => video },
		HlsJs: { connected: false, disconnect() {}, connect: async (_video, _source, options) => {
			callbacks = options
		} },
	})
	const player = new Video({ onAudioBlocked: () => blocked++ })
	player.connect("revision-1")
	await callbacks.onManifestParsed()
	assert.equal(video.muted, true)
	assert.equal(plays, 2)
	assert.equal(blocked, 1)
})

test("chat retains bounded history before its modal opens and ignores invalid messages", () => {
	let receive
	const messages = []
	const Chat = load("frontend/apps/livestream/chat-page/Chat.js", "Chat", {
		Listener: () => ({ trigger: line => messages.push(line), listen() {} }),
		SocketClient: { onClientMessage: (_action, callback) => {
			receive = callback
		}, sendToAllUsers() {
			assert.fail("empty messages must not send")
		} },
	})
	receive({ data: { name: "viewer", message: null } })
	Chat.sendMessage("   ")
	for (let i = 0; i < 205; i++) {
		receive({ data: { name: "viewer", message: String(i) } })
	}
	assert.equal(Chat.history.length, 200)
	assert.equal(Chat.history[0].message, "5")
	assert.equal(messages.length, 205)
})

test("microphone radio selection calls the component's bound method", async () => {
	const file = new URL("../../frontend/apps/livestream/livestream_streamer/streamer/mic-settings-page/mic-settings-page.js", import.meta.url)
	const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), []).replace("export default", "return")
	let select
	const stream = { audioDeviceId: "old", setAudioDevice: async id => {
		stream.audioDeviceId = id
	} }
	const html = { fields: {}, micStatus: {}, micList: { clearChildren() {}, add() {} } }
	const options = new Function("Assert", "IfCondition", "Stream", "Permission", "Mic", "H", source)(
		{ notNull: value => assert.ok(value != null) }, { validate: Boolean }, stream,
		{ request: async () => {} }, { all: async () => [{ deviceId: "selected", label: "USB microphone" }] },
		{ radio: options => {
			select = options.onSelect
			return { input: { dataset: options.data, checked: true } }
		} },
	)
	html.whenReady = async () => ({ methods: { applyMicSelection: () => options.methods.applyMicSelection(html) } })
	await options.onDomAdd({ html })
	await select()
	assert.equal(stream.audioDeviceId, "selected")
	assert.match(html.micStatus.content, /Microphone active: USB microphone/)
})
