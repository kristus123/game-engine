export class Microphone {
	static recorder = null
	static chunks = []
	static ready = false
	static state = 'idle' // idle, recording, stopped

	static {
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
  	if (this.state === 'recording') {
				throw new Error('Microphone already recording')
			}
  	this.chunks = []
  	this.recorder.start()
  	this.state = 'recording'
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
  	if (this.state !== 'recording') {
				throw new Error('Microphone not recording')
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

