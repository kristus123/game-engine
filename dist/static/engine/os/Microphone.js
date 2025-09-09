import { a } from '/static/engine/assertions/a.js'; 

export class Microphone {
	static recorder = null
	static chunks = []
	static ready = false
	static state = 'idle' // idle, recording, stopped

	static {
		navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
			this.recorder = new MediaRecorder(stream, {
				mimeType: 'audio/webm;codecs=opus',
				audioBitsPerSecond: 64_000 // x kbps // Chrome / Edge (WebM/Opus): typically 128–192 kbps
			})

			this.recorder.ondataavailable = e => this.chunks.push(e.data)
			this.ready = true
		})
	}

	static start() {
		const wait = () => {
			if (!this.ready) {
				return setTimeout(wait, 10)
			}
			else if (this.state === 'recording') {
				throw new Error('Microphone already recording')
			}

			this.chunks = []
			this.recorder.start()
			this.state = 'recording'

		}

		wait()
	}

	static stop(callback) {
		const wait = () => {
			if (!this.ready) {
				return setTimeout(wait, 10)
			}
			else if (this.state !== 'recording') {
				throw new Error('Microphone not recording')
			}
			else {

			}

			this.recorder.onstop = () => {
				const blob = new Blob(this.chunks, { type: 'audio/webm' })
				this.chunks = []
				this.state = 'stopped'

				if (callback) {
					callback(blob)
				}
			}

			this.recorder.stop()
		}
		wait()
	}
}

