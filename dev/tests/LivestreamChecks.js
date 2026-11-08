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
		Assert: { notNull: value => assert.notEqual(value, null) },
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
	const Queue = load("frontend/apps/livestream/media/PromiseQueue.js", "PromiseQueue")
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

function publisherFixture() {
	const storage = new Map()
	const requests = []
	let failStop = false
	let startReply = async () => ({ accepted: true })
	const recorder = { active: false, start: () => {
		recorder.active = true
	}, stop: () => {
		recorder.active = false
	} }
	const result = body => ({ ok: true, body })
	const Stream = load("frontend/apps/livestream/media/Stream.js", "Stream", {
		Assert: {
			notNull: value => assert.notEqual(value, null),
			true: value => assert.equal(value, true),
			ok: response => {
				assert.equal(response.ok, true); return response.body
			},
		},
		Listener: class {
			trigger() {}
		},
		Network: { offline: false, onOffline: () => {} },
		Config: { streamStallMs: 8_000 },
		Platform: { mimeType: "video/webm" },
		Token: { userId: "22222222-2222-2222-2222-222222222222" },
		SetTimeoutLoop: () => ({}),
		BetterMediaRecorder: recorder,
		localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
		SwappableMediaStream: { prepare: async () => {}, videoDeviceId: null, audioDeviceId: null, video: { srcObject: null }, audioContext: { resume: async () => {} } },
		JsonHttpClient: {
			startStream: async ({ body }) => {
				requests.push(body); return result(await startReply())
			},
			stopStream: async () => {
				if (failStop) {
					throw new Error("offline")
				} return result({ accepted: true })
			},
		},
	})
	return { Stream, storage, recorder, requests, failStop: value => {
		failStop = value
	}, startReply: reply => {
		startReply = reply
	} }
}

test("publisher resumes with a fresh recording and persists an offline stop until it succeeds", async () => {
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
	assert.equal(JSON.parse(f.storage.get(f.Stream.storageKey)).stopping, true)
	f.failStop(false)
	await f.Stream.maintain()
	assert.equal(f.Stream.broadcast, null)
	assert.equal(f.storage.size, 0)
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
	await Promise.resolve()
	await f.Stream.stop()
	finish({ accepted: true })
	await starting
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

test("the viewer throws immediately when hls.js is unsupported", () => {
	const Video = load("frontend/apps/livestream/ui/viewer/HlsVideo.js", "HlsVideo", {
		HlsJs: { supported: false },
		Assert: {
			notNull: value => assert.notEqual(value, null),
			true: (value, message) => {
				if (!value) {
					throw new Error(message)
				}
			},
		},
	})
	assert.throws(() => new Video(), /does not support hls.js/)
})

test("replacing an encoder early does not shorten or extend the media deadline", async () => {
	const f = broadcastFixture()
	await f.Broadcast.start(f.identity)
	await f.write()
	f.advance(2_000)
	await f.Broadcast.start({ ...f.identity, revision: 2, resume: true })
	assert.equal(f.Broadcast.status().remainingMs, 58_000)
})

function mediaFixture() {
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
	const Media = load("frontend/apps/livestream/media/SwappableMediaStream.js", "SwappableMediaStream", {
		Assert: { notNull: value => assert.notEqual(value, null) },
		document: { createElement: () => ({ play: async () => {} }) },
		FrameLoop: () => {},
		H: { CanvasWithStream: () => ({ ctx: { fillRect() {} }, canvas: { width: 1280, height: 720 }, canvasStream: new Tracks([track("video", "canvas")]) }) },
		MediaStream: Tracks,
		AudioContext: class {
			resume = async () => {}
			createMediaStreamDestination() {
				return { stream: new Tracks([track("audio", "mixed")]) }
			}

			createDynamicsCompressor() {
				return { ...node(), threshold: {}, knee: {}, ratio: {}, attack: {}, release: {} }
			}

			createMediaStreamSource() {
				return node()
			}
		},
		Permission: { request: async () => {} },
		MediaDevices: {
			audio: async id => {
				requests.push(["audio", id]); return new Tracks([track("audio", id ?? "default-mic")])
			},
			video: async id => {
				requests.push(["video", id]); return new Tracks([track("video", id ?? "default-camera")])
			},
		},
	})
	return { Media, requests }
}

test("media preparation opens default mic and camera once and preserves explicit selections and muting", async () => {
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
	Media.clearAudioDevice()
	await Media.prepare()
	assert.equal(Media.audioDeviceId, null)
	assert.equal(requests.length, 4)
})

test("default device requests omit exact device constraints", async () => {
	const requests = []
	const Devices = load("frontend/tools/core/os/devices/MediaDevices.js", "MediaDevices", {
		Assert: { notNull: value => assert.notEqual(value, null), true: value => assert.equal(value, true) },
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
	const Recorder = load("frontend/apps/livestream/media/BetterMediaRecorder.js", "BetterMediaRecorder", {
		Assert: { notNull: value => assert.notEqual(value, null), null: value => assert.equal(value, null) },
		SwappableMediaStream: { prepare: () => new Promise(resolve => {
			finish = resolve
		}) },
		MediaRecorder: class {
			constructor() {
				recorders++
			}
		},
	})
	const starting = Recorder.start(() => {}, () => {})
	Recorder.stop()
	finish()
	await starting
	assert.equal(recorders, 0)
})
