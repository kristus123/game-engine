export class Livestream {
	constructor() {
		Execute(async () => {
			const html = Dom.add(Html.livestream())

			const body = Assert.ok(await HttpClient.currentlyStreaming())

			if (body.streaming) {
				html.clearChildren()

				const video = HlsVideo()
				html.add(video)
			}
			else {
				html.start.onClick(async () => {
					Assert.ok(await HttpClient.startStream())

					const stream = await navigator.mediaDevices.getUserMedia({
						video: true,
						audio: true
					})

					const mediaRecorder = new MediaRecorder(stream)

					mediaRecorder.ondataavailable = async e => {
						if (e.data.size == 0) {
							return
						}

						console.log(e.data.type)

						HttpClient.sendChunk({
							rawBody: e.data,
							contentType: mediaRecorder.mimeType,
							ok: () => {
								console.log("ok!")
							},
							error: () => {
								console.log("error!")
							},
						})
					}

					mediaRecorder.start(5_000)
				})
			}
		})
	}

	update() {

	}
}
