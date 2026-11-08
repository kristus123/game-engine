export class HlsBroadcast {
	static session = null
	static pending = Promise.resolve()

	static run(callback) {
		const result = this.pending.then(callback)
		this.pending = result.catch(error => console.warn("Broadcast operation failed", error))
		return result
	}

	static deadline() {
		return this.session.lastMediaAt + Config.streamStallMs + Config.streamReconnectMs
	}

	static async expire() {
		if this.session && Date.now() >= this.deadline() {
			await this.stop(this.session.sessionId, this.session.userId)
		}
	}

	static status() {
		const session = this.session
		if !session {
			return { online: false, state: "offline", playbackId: null, remainingMs: 0 }
		}
		const reconnecting = Date.now() >= session.lastMediaAt + Config.streamStallMs
		const online = !reconnecting && this.processAlive && session.hasMedia
		return {
			online,
			state: reconnecting ? "reconnecting" : online ? "live" : "starting",
			playbackId: `${session.userId}-${session.revision}`,
			remainingMs: Math.max(0, this.deadline() - Date.now()),
		}
	}

	static get processAlive() {
		const child = Ffmpeg.p?.p
		return child != null && child.exitCode == null && child.signalCode == null
	}

	static async start({ sessionId, userId, revision, mimeType, resume = false }) {
		await this.expire()
		if ![sessionId, userId].every(id => typeof id == "string" && /^[a-f0-9-]{36}$/.test(id)) || !Number.isSafeInteger(revision) || revision < 0 || mimeType != "webm" {
			throw new Error("Invalid broadcast identifiers or unsupported recording format")
		}
		if resume && this.session?.sessionId != sessionId {
			return { accepted: false, expired: true }
		}
		if this.session && (this.session.sessionId != sessionId || this.session.userId != userId) {
			return { accepted: false, expired: false }
		}
		if this.session?.revision == revision && this.processAlive {
			return { accepted: true }
		}
		if !this.session {
			this.session = { sessionId, userId, lastMediaAt: Date.now(), hasMedia: false }
		}
		Object.assign(this.session, { revision, sequence: -1, hasMedia: false })
		if Ffmpeg.p {
			await Ffmpeg.stop()
		}
		Files.deleteFilesInFolder("public_folder/hls")
		await Ffmpeg.start(mimeType, userId, revision)
		const child = Ffmpeg.p.p
		child.once("exit", () => {
			if this.session?.revision == revision {
				this.session.lastMediaAt = Math.min(this.session.lastMediaAt, Date.now() - Config.streamStallMs)
			}
		})
		return { accepted: true }
	}

	static async write({ sessionId, userId, revision, sequence }, buffer) {
		await this.expire()
		const session = this.session
		if !session || session.sessionId != sessionId || session.userId != userId {
			return { accepted: false, expired: true }
		}
		sequence = Number(sequence)
		revision = Number(revision)
		if session.revision != revision || !Number.isSafeInteger(sequence) || sequence < 0 || !this.processAlive {
			return { accepted: false, expired: false }
		}
		// A retried request must never feed the same media bytes to the encoder twice.
		if sequence <= session.sequence {
			return { accepted: true }
		}
		if sequence != session.sequence + 1 || buffer.length == 0 {
			return { accepted: false, expired: false }
		}
		await Ffmpeg.write(buffer)
		session.sequence = sequence
		session.hasMedia = true
		session.lastMediaAt = Date.now()
		return { accepted: true }
	}

	static async stop(sessionId, userId) {
		if this.session?.sessionId != sessionId || this.session?.userId != userId {
			return { accepted: false, expired: true }
		}
		this.session = null
		if Ffmpeg.p {
			await Ffmpeg.stop()
		}
		Files.deleteFilesInFolder("public_folder/hls")
		return { accepted: true }
	}
}
