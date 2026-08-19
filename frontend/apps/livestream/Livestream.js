export class Livestream {
	constructor() {

		const html = Dom.add(Html.livestream())

		html.watch.onClick(() => {
			html.clearChildren()
			html.add(`
				<video
					src="${Config.httpUrl}/public_folder/hls/output.m3u8"
					controls
					autoplay
					muted
				></video>
			`)
		})

		html.start.onClick(async () => {
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
					contentType: 'video/webm',
					ok: () => {
						console.log("ok!")
					},
					error: () => {
						console.log("error!")
					},
				})
			}

			mediaRecorder.start(1000)
		})
	}

	update() {

	}
}
