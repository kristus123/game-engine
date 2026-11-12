export class Stream {

	static broadcast = null
	static recovering = null
	static lastUploadAt = 0
	static startAttempt = 0
	static state = "offline"
	static onChange = null
	static loop = null
	static uploadsInFlight = 0
	static finishingStop = null
	static recorder = null

	static async status() {
		return Assert.ok(await JsonHttpClient.streamOnline({ timeoutMs: 3_000 }))
	}

	static async online() {
		return (await this.status()).online
	}

	static setState(state) {
		this.state = state
		this.onChange?.(state)
	}

	static init() {
		if this.loop {
			return
		}
		Network.onOffline(() => this.interrupt())
		this.loop = SetTimeoutLoop(2_000, () => this.maintain())
	}

	static interrupt() {
		if this.broadcast && !this.broadcast.stopping {
			this.recorder?.stop()
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
		if this.recorder?.active && this.uploadsInFlight == 0 && Date.now() - this.lastUploadAt >= Config.streamStallMs {
			this.interrupt()
		}
		if !this.recorder?.active && this.uploadsInFlight == 0 {
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
			revision: Date.now(),
			userId: Token.userId,
			recordingStarted: false,
			videoDeviceId: SwappableMediaStream.videoDeviceId,
			audioDeviceId: this.audioDeviceId,
		}
		SoundContext.resume().catch(error => console.warn("Could not resume audio", error))
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
				this.setState(result.expired ? "ended" : "busy")
				return
			}
			await SwappableMediaStream.prepare({
				audioDeviceId: broadcast.audioDeviceId,
				videoDeviceId: broadcast.videoDeviceId,
			})
			broadcast.audioDeviceId = this.audioDeviceId
			broadcast.videoDeviceId = SwappableMediaStream.videoDeviceId
			if this.broadcast != broadcast || broadcast.stopping {
				return
			}
			SoundContext.resume().catch(error => console.warn("Could not resume audio", error))
			broadcast.recordingStarted = true
			let sequence = 0
			const revision = broadcast.revision
			this.lastUploadAt = Date.now()
			this.recorder = MediaRecorder.v2Start(async blob => {
				// Fetch retries reuse this sequence, which the server deduplicates.
				const params = new URLSearchParams({ revision, sequence: sequence++ })
				this.uploadsInFlight++
				try {
					const upload = Assert.ok(await LowLevelHttpClient.post({
						routeName: `sendChunk?${params}`,
						body: blob,
						formatBody: response => response.json(),
						contentType: Platform.mimeType,
						timeoutMs: 8_000,
					}))
					if !this.recorder?.active || this.broadcast != broadcast || broadcast.stopping || broadcast.revision != revision {
						return
					}
					if !upload.accepted {
						throw new Error("Media upload was rejected")
					}
					this.lastUploadAt = Date.now()
					this.setState("live")
				}
				finally {
					this.uploadsInFlight--
				}
			}, error => {
				console.warn("Broadcast interrupted", error)
				this.interrupt()
			}, {
				audioBitsPerSecond: 64_000,
				videoBitsPerSecond: 1_800_000,
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
		this.recorder?.stop()
		this.recorder = null
		this.setState("stopping")
		await this.finishStop()
	}

	static async finishStop() {
		if (this.finishingStop) {
			return this.finishingStop
		}
		this.finishingStop = this.finishStopRequest().finally(() => {
			this.finishingStop = null
		})
		return this.finishingStop
	}

	static async finishStopRequest() {
		if (this.recovering) {
			await this.recovering
		}
		const broadcast = this.broadcast
		if (!broadcast || !broadcast.stopping) {
			return
		}
		try {
			const result = Assert.ok(await JsonHttpClient.stopStream({ body: { revision: broadcast.revision }, timeoutMs: 3_000 }))
			if !result.accepted {
				const status = await this.status()
				if status.state == "offline" {
					this.clearBroadcast(broadcast, "offline")
					return
				}
				if status.playbackId != `${broadcast.userId}-${broadcast.revision}` {
					this.clearBroadcast(broadcast, "busy")
					return
				}
				throw new Error("The server has not confirmed that this broadcast stopped")
			}
			this.clearBroadcast(broadcast, "offline")
		}
		catch (error) {
			console.warn("Stop will be retried when the connection returns", error)
		}
	}

	static clearBroadcast(broadcast, state) {
		if this.broadcast == broadcast {
			this.broadcast = null
			this.setState(state)
		}
	}

	static get audioDeviceId() {
		return SwappableMediaStream.audioDeviceId
	}

	static async setAudioDevice(deviceId) {
		await SwappableMediaStream.setAudioDevice(deviceId)
		if this.broadcast {
			this.broadcast.audioDeviceId = deviceId
		}
	}

	static async swapVideo(deviceId) {
		await SwappableMediaStream.swapVideo(deviceId)
		if this.broadcast {
			this.broadcast.videoDeviceId = deviceId
		}
	}
}
