export class Livestream {
	constructor() {
		Execute(async () => {
			const html = Dom.add(Html.livestream())

			console.log("hei")
			const { streaming } = Assert.ok(await JsonHttpClient.currentlyStreaming())

			if (streaming) {
				html.clearChildren()
				html.add(HlsVideo())
			}
			else {
				html.start.onClick(async () => {
					console.log("hide")
					html.start.hide()
					html.stop.show()

					Assert.ok(await NullHttpClient.startStream())

					const stream = await navigator.mediaDevices.getUserMedia({
						video: true,
						audio: {
							echoCancellation: false,
							noiseSuppression: false,
							autoGainControl: false,
						}
					})

					Log("getUserMedia started")

					html.stop.before(H.streamVideo(stream).setId("video"))

					html.getId("video").style.transform = "scaleX(-1)"

					html.stop.show()
					html.stop.onClick(async () => {
						console.log("clicked stop")
						Assert.ok(await NullHttpClient.stopStream())
						html.getId("video").remove()
					})

					const mimeType = Platform.safari
						? "video/mp4;codecs=h264,aac" // safari
						: "video/webm;codecs=vp8,opus" // chrome
					console.log("-----------------", mimeType)

					const mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType })

					mediaRecorder.ondataavailable = async e => {
						if (e.data.size > 0) {
							LowLevelHttpClient.post({
								routeName: "sendChunk",
								body: e.data,
								formatBody: r => null,
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
