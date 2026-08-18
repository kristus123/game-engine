export class Livestream {
	constructor() {
		this.start()
	}

	async start() {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		})

		const mediaRecorder = new MediaRecorder(stream)

		mediaRecorder.ondataavailable = async e => {
			if (e.data.size == 0) {
				return
			}

			HttpClient.sendChunk({
				rawBody: e.data,
				ok: () => {
					console.log("ok!")
				},
				error: () => {
					console.log("error!")
				},
			})
		}

		mediaRecorder.start(1000)

	}

	update() {

	}
}
