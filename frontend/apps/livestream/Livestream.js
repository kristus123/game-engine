export class Livestream {
	constructor() {
		Execute(async () => {
			const x = await HttpClient.currentlyStreaming()
			console.log(x)
			const { body: { streaming } } = Assert.ok(x)

			const html = Dom.add(Html.livestream())

			if (streaming) {
				html.clearChildren()
				html.add(`
					<video
						src="${Config.httpUrl}/public_folder/hls/output.m3u8"
						controls
						autoplay
						muted
						playsinline
					></video>
				`)
			}
			else {
				html.start.onClick(async () => {
					await Assert.ok(HttpClient.startStream())

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
							contentType: "video/webm",
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
