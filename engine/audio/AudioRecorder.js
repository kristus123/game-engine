export class AudioRecorder {
	static {
    	this.recorder = null
	}

	static async startRecording(onStop) {
    	console.log('recording...')

    	const audioChunks = []

    	const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    	this.recorder = new MediaRecorder(stream)

    	this.recorder.ondataavailable = e => {
        	if (e.data.size > 0) {
            	audioChunks.push(e.data)
        	}
    	}

    	this.recorder.onstop = () => {
        	const blob = new Blob(audioChunks, { type: 'audio/webm' })
        	const url = URL.createObjectURL(blob)

        	// do something with this url?
        	console.log(url)

        	onStop(blob)
    	}

    	this.recorder.start()
	}

	static stopRecording() {
    	console.log('stopped!')
    	this.recorder.stop()
	}
}