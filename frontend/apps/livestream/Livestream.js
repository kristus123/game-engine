function doSleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function CheckUntilOk(callback) {
	return new Promise(resolve => {
		const check = async () => {
			try {
				if (await callback()) {
					resolve(true)
				}
				else {
					setTimeout(check, 1000)
				}
			}
			catch {
				setTimeout(check, 1000)
			}
		}

		check()
	})
}

function debounce(callback, delay) {
	let timeout

	return (...args) => {
		clearTimeout(timeout)

		timeout = setTimeout(() => {
			callback(...args)
		}, delay)
	}
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

				let reconnecting = false

				const reconnect = debounce(async () => {
					if (reconnecting) {
						return
					}

					reconnecting = true

					try {
						console.log("reconnecting")

						await CheckUntilOk(async () => {
							video.reloadSrc()

							return new Promise(resolve => {
								let timeout

								const cleanup = () => {
									clearTimeout(timeout)
									video.removeEventListener("canplay", onCanPlay)
									video.removeEventListener("error", onError)
									video.removeEventListener("stalled", onError)
								}

								const onCanPlay = async () => {
									cleanup()

									try {
										await video.play()
										resolve(true)
									}
									catch {
										resolve(false)
									}
								}

								const onError = () => {
									cleanup()
									resolve(false)
								}

								timeout = setTimeout(() => {
									cleanup()
									resolve(false)
								}, 5000)

								video.addEventListener("canplay", onCanPlay, { once: true })
								video.addEventListener("error", onError, { once: true })
								video.addEventListener("stalled", onError, { once: true })

								if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
									onCanPlay()
								}
							})
						})

						console.log("reconnected")
					}
					finally {
						reconnecting = false
					}
				}, 1000)

				video.addEventListener("error", () => {
					console.log("error")
					reconnect()
				})

				video.addEventListener("ended", () => {
					console.log("ended")
					reconnect()
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
