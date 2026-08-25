export class Livestream {
	constructor() {
		Execute(async () => {
			const html = Dom.add(Html.livestream())

			const body = Assert.ok(await HttpClient.currentlyStreaming())

			if (body.streaming) {
				html.clearChildren()
				html.add(HlsVideo())
			}
			else {
				html.start.onClick(async () => {
					Assert.ok(await HttpClient.startStream())

					const stream = await navigator.mediaDevices.getUserMedia({
						video: true,
						audio: {
							echoCancellation: false,
							noiseSuppression: false,
							autoGainControl: false,
						}
					})

					Log("getUserMedia started")

					html.clearChildren()
					html.add(H.streamVideo(stream))

					const mimeType = Platform.safari()
						? "video/mp4;codecs=h264,aac" // safari
						: "video/webm;codecs=vp8,opus" // chrome

					const mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType })

					mediaRecorder.ondataavailable = async e => {
						if (e.data.size > 0) {
							HttpClient.sendChunk({
								rawBody: e.data,
								contentType: mimeType,
								ok: () => {
									Log("ok!")
								},
								error: () => {
									Log("error!")
								},
							})
						}
					}

					mediaRecorder.start(5_000)
				})
			}
		})
	}

	update() {

	}
}
