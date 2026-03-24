export class Microphone {
	static recorder = null
	static chunks = []
	static state = "idle" // idle, recording, stopped
	static mimeType = "audio/webm;codecs=opus"
	static audioBitsPerSecond = 64_000
	static ready = false

	static {
		navigator.mediaDevices.getUserMedia({ audio: true })
  	.then(stream => {
				Microphone.recorder = new MediaRecorder(stream, {
  		mimeType: Microphone.mimeType,
  		audioBitsPerSecond: Microphone.audioBitsPerSecond,
				})

				Microphone.recorder.ondataavailable = e => Microphone.chunks.push(e.data)
				Microphone.ready = true
  	})
  	.catch(err => {
				console.error("Failed to access microphone:", err)
  	})
	}

	static start() {
		if (!Microphone.ready) {
  	throw new Error("Microphone not ready yet")
		}
		if (Microphone.state === "recording") {
  	throw new Error("Microphone already recording")
		}

		Microphone.chunks = []
		Microphone.recorder.start()
		Microphone.state = "recording"
	}

	static stop(callback) {
		if (!Microphone.ready) {
  	throw new Error("Microphone not ready yet")
		}
		if (Microphone.state !== "recording") {
  	throw new Error("Microphone not recording")
		}

		Microphone.recorder.onstop = () => {
  	const blob = new Blob([...Microphone.chunks], { type: Microphone.mimeType })
  	Microphone.chunks = []
  	Microphone.state = "stopped"

  	if (typeof callback === "function") {
				callback(blob)
  	}
		}

		Microphone.recorder.stop()
	}

	static getState() {
		return Microphone.state
	}
}
