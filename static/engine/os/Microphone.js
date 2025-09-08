// doesn't behave same on phone and pc

export class Microphone {
	static {
		this.recorder = null
		this.chunks = []
		this.ready = false

		navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  	this.recorder = new MediaRecorder(stream)
  	this.recorder.ondataavailable = e => this.chunks.push(e.data)
  	this.ready = true
		})
	}

	static start(callback) {
		const wait = () => {
  	if (!this.ready) {
				return setTimeout(wait, 10)
			}
  	this.chunks = []
  	this.recorder.start()
  	if (callback) {
				callback()
			}
		}
		wait()
	}

	static stop(callback) {
		const wait = () => {
  	if (!this.ready) {
				return setTimeout(wait, 10)
			}
  	this.recorder.onstop = () => {
				const blob = new Blob(this.chunks, { type: 'audio/webm' })
				this.chunks = []
				if (callback) {
					callback(blob)
				}
  	}
  	this.recorder.stop()
		}
		wait()
	}
}

