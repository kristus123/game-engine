export class BetterMediaRecorder {
	static mediaRecorder = null
	static generation = 0

	static async start(onBlob, onError) {
		Assert.null(this.mediaRecorder)
		const generation = ++this.generation
		await SwappableMediaStream.prepare()
		if generation != this.generation {
			return
		}
		const recorder = new MediaRecorder(SwappableMediaStream.stream, { mimeType: Platform.mimeType })
		const queue = PromiseQueue()
		let pendingBytes = 0
		this.mediaRecorder = recorder

		recorder.ondataavailable = e => {
			if e.data.size == 0 || this.mediaRecorder != recorder {
				return
			}
			pendingBytes += e.data.size
			if pendingBytes > 16 * 1024 * 1024 {
				onError(new Error("Upload could not keep up with recording"))
				return
			}
			queue.add(async () => {
				try {
					if this.mediaRecorder == recorder {
						await onBlob(e.data)
					}
				}
				finally {
					pendingBytes -= e.data.size
				}
			}).catch(error => {
				if this.mediaRecorder == recorder {
					onError(error)
				}
			})
		}
		recorder.onerror = event => onError(event.error ?? new Error("Recording interrupted"))
		recorder.onstop = () => {
			if this.mediaRecorder == recorder {
				onError(new Error("Recording stopped unexpectedly"))
			}
		}
		recorder.start(Config.hlsTime * 1_000)
	}

	static stop() {
		this.generation++
		const recorder = this.mediaRecorder
		this.mediaRecorder = null
		if recorder && recorder.state != "inactive" {
			recorder.stop()
		}
	}

	static get active() {
		return this.mediaRecorder != null
	}
}
