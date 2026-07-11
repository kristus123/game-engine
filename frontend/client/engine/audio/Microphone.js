// I did find Mic.js but focused on stuff near Mix.js because Kristian suggested me to.
// I tried to keep it similar to Webcam.js

export class Microphone {
	static stream = null

    static async enable() {
        this.stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        })

        const source = SoundContext.context.createMediaStreamSource(this.stream)
        source.connect(Mix.fx.input)
    }

    static connect(input) {
        const source = SoundContext.context.createMediaStreamSource(this.stream)
        source.connect(input)
    }
}

