function doSleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function CheckUntilOk(callback) {
	return new Promise(resolve => {
		const check = () => {
			if (callback()) {
				resolve(true)
			}
			else {
				setTimeout(check, 100)
			}
		}

		check()
	})
}



export class Livestream {
	constructor() {
		Execute(async () => {
			const html = Dom.add(Html.livestream())

			const r = (await HttpClient.currentlyStreaming()).assertOk()
			console.log(r)

			if (r.streaming) {
				html.clearChildren()

				const video = `
					<video
						src="${Config.httpUrl}/public_folder/hls/output.m3u8"
						controls
						autoplay
						muted
						playsinline
					></video>
				`.toHtml()
				html.add(video)

				video.addEventListener("loadedmetadata", () => {
					console.log("loadedmetadata")
				})
				video.addEventListener("canplay", () => {
					console.log("canplay")
					html.clearChildren()
					html.add(video)
				})
				video.addEventListener("playing", () => {
					console.log("playing")
				})
				video.addEventListener("waiting", () => {
					console.log("waiting")
				})
				video.addEventListener("stalled", () => {
					console.log("stalled")
				})
				video.addEventListener("error", () => {
					console.log("error")
					CheckUntilOk(async () => {
						video.reloadSrc()
						await doSleep(500)
						const x = video.canPlay
						video.play()
						return x
					})
				})
				video.addEventListener("ended", () => {
					console.log("ended")
				})

			}
			else {
				html.start.onClick(async () => {
					(await HttpClient.startStream()).assertOk()

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
