export class Stream {
	static storageKey = "livestreamBroadcast"
	static broadcast = null
	static recovering = null
	static lastUploadAt = 0
	static startAttempt = 0
	static state = "offline"
	static changes = new Listener()
	static loop = null

	static async status() {
		return Assert.ok(await JsonHttpClient.streamOnline({ timeoutMs: 3_000 }))
	}

	static async online() {
		return (await this.status()).online
	}

	static setState(state) {
		this.state = state
		this.changes.trigger(state)
	}

	static save() {
		if this.broadcast {
			localStorage.setItem(this.storageKey, JSON.stringify(this.broadcast))
		}
		else {
			localStorage.removeItem(this.storageKey)
		}
	}

	static init() {
		if this.loop {
			return
		}
		try {
			this.broadcast = JSON.parse(localStorage.getItem(this.storageKey))
			if this.broadcast && (this.broadcast.userId != Token.userId || typeof this.broadcast.sessionId != "string" || !Number.isSafeInteger(this.broadcast.revision)) {
				this.broadcast = null
				this.save()
			}
		}
		catch {
			localStorage.removeItem(this.storageKey)
		}
		Network.onOffline(() => this.interrupt())
		this.loop = SetTimeoutLoop(2_000, () => this.maintain())
	}

	static interrupt() {
		if this.broadcast && !this.broadcast.stopping {
			BetterMediaRecorder.stop()
			this.setState("reconnecting")
		}
	}

	static async maintain() {
		if !this.broadcast || Network.offline {
			return
		}
		if this.broadcast.stopping {
			await this.finishStop()
			return
		}
		if BetterMediaRecorder.active && Date.now() - this.lastUploadAt >= Config.streamStallMs {
			this.interrupt()
		}
		if !BetterMediaRecorder.active {
			await this.recover(true)
		}
	}

	static async start() {
		this.init()
		if this.recovering {
			await this.recovering
		}
		if this.broadcast {
			throw new Error("A broadcast is already active or waiting to stop")
		}
		Assert.true(Platform.mimeType.includes("webm"), "Livestream broadcasting currently requires a browser with WebM recording")
		const attempt = ++this.startAttempt
		await SwappableMediaStream.prepare()
		if attempt != this.startAttempt {
			return
		}
		this.broadcast = {
			sessionId: crypto.randomUUID(),
			revision: Date.now(),
			userId: Token.userId,
			recordingStarted: false,
			videoDeviceId: SwappableMediaStream.videoDeviceId,
			audioDeviceId: this.audioDeviceId,
		}
		this.save()
		SwappableMediaStream.audioContext.resume().catch(error => console.warn("Could not resume audio", error))
		await this.recover(false)
	}

	static recover(resume) {
		if this.recovering {
			return this.recovering
		}
		this.recovering = this.startRecording(resume).finally(() => {
			this.recovering = null
		})
		return this.recovering
	}

	static async startRecording(resume) {
		const broadcast = this.broadcast
		this.setState(resume ? "reconnecting" : "starting")
		// Keep this identifier across a failed start request: its response may have been lost.
		if resume && broadcast.recordingStarted {
			broadcast.revision = Math.max(Date.now(), broadcast.revision + 1)
		}
		broadcast.recordingStarted = false
		this.save()
		try {
			const result = Assert.ok(await JsonHttpClient.startStream({
				body: { ...broadcast, resume, mimeType: "webm" },
				timeoutMs: 3_000,
			}))
			if this.broadcast != broadcast || broadcast.stopping {
				return
			}
			if !result.accepted {
				this.broadcast = null
				this.save()
				this.setState(result.expired ? "ended" : "busy")
				return
			}
			await SwappableMediaStream.prepare({
				audioDeviceId: broadcast.audioDeviceId,
				videoDeviceId: broadcast.videoDeviceId,
			})
			if this.broadcast != broadcast || broadcast.stopping {
				return
			}
			SwappableMediaStream.audioContext.resume().catch(error => console.warn("Could not resume audio", error))
			broadcast.recordingStarted = true
			this.save()
			let sequence = 0
			const revision = broadcast.revision
			this.lastUploadAt = Date.now()
			await BetterMediaRecorder.start(async blob => {
				const params = new URLSearchParams({ sessionId: broadcast.sessionId, revision, sequence: sequence++ })
				const upload = Assert.ok(await LowLevelHttpClient.post({
					routeName: `sendChunk?${params}`,
					body: blob,
					formatBody: response => response.json(),
					contentType: Platform.mimeType,
					timeoutMs: 3_000,
				}))
				if !BetterMediaRecorder.active || this.broadcast != broadcast || broadcast.stopping || broadcast.revision != revision {
					return
				}
				if !upload.accepted {
					throw new Error("Media upload was rejected")
				}
				this.lastUploadAt = Date.now()
				this.setState("live")
			}, error => {
				console.warn("Broadcast interrupted", error)
				this.interrupt()
			})
		}
		catch (error) {
			console.warn("Could not connect broadcast", error)
			if this.broadcast == broadcast && !broadcast.stopping {
				this.interrupt()
			}
		}
	}

	static async stop() {
		this.startAttempt++
		if !this.broadcast {
			return
		}
		this.broadcast.stopping = true
		this.save()
		BetterMediaRecorder.stop()
		this.setState("stopping")
		await this.finishStop()
	}

	static async finishStop() {
		const broadcast = this.broadcast
		try {
			Assert.ok(await JsonHttpClient.stopStream({ body: { sessionId: broadcast.sessionId }, timeoutMs: 3_000 }))
			if this.broadcast == broadcast {
				this.broadcast = null
				this.save()
				this.setState("offline")
			}
		}
		catch (error) {
			console.warn("Stop will be retried when the connection returns", error)
		}
	}

	static get audioDeviceId() {
		return SwappableMediaStream.audioDeviceId
	}

	static async setAudioDevice(deviceId) {
		await SwappableMediaStream.setAudioDevice(deviceId)
		if this.broadcast {
			this.broadcast.audioDeviceId = deviceId
			this.save()
		}
	}

	static clearAudioDevice() {
		SwappableMediaStream.clearAudioDevice()
		if this.broadcast {
			this.broadcast.audioDeviceId = null
			this.save()
		}
	}

	static async swapVideo(deviceId) {
		await SwappableMediaStream.swapVideo(deviceId)
		if this.broadcast {
			this.broadcast.videoDeviceId = deviceId
			this.save()
		}
	}
}
