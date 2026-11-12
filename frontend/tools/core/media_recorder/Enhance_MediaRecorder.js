export class Enhance_MediaRecorder extends NativeEnhancer {

	constructor() {
		super(MediaRecorder)
	}

	v2Start(onBlob, onError, recorderOptions = {}) {
		let stopped = false
		let recorder = null
		let pendingBytes = 0
		const queue = PromiseQueue()
		const handle = {
			stop: () => {
				stopped = true
				const activeRecorder = recorder
				recorder = null
				if activeRecorder && activeRecorder.state != "inactive" {
					activeRecorder.stop()
				}
			},
			get active() {
				return !stopped
			},
		}

		;(async () => {
			try {
				await SwappableMediaStream.prepare()
				if stopped {
					return
				}
				recorder = new MediaRecorder(SwappableMediaStream.mediaStream, { mimeType: Platform.mimeType, ...recorderOptions })
				recorder.ondataavailable = event => {
					if event.data.size == 0 || stopped {
						return
					}
					pendingBytes += event.data.size
					if pendingBytes > 16 * 1024 * 1024 {
						onError(new Error("Upload could not keep up with recording"))
						return
					}
					queue.add(async () => {
						try {
							if !stopped {
								await onBlob(event.data)
							}
						}
						finally {
							pendingBytes -= event.data.size
						}
					}).catch(error => {
						if !stopped {
							onError(error)
						}
					})
				}
				recorder.onerror = event => {
					if !stopped {
						onError(event.error ?? new Error("Recording interrupted"))
					}
				}
				recorder.onstop = () => {
					if !stopped {
						onError(new Error("Recording stopped unexpectedly"))
					}
				}
				recorder.start(Config.hlsTime * 1_000)
			}
			catch (error) {
				if !stopped {
					onError(error)
				}
			}
		})()

		return handle
	}
}
