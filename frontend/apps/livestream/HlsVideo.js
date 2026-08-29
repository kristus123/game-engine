export function HlsVideo({ playing, error } = {}) {

	const v = `
		<video
			src="${Config.httpUrl}/public_folder/hls/output.m3u8"
			controls
			autoplay
			muted
			playsinline
		></video>
	`.toHtml()

	v.controls = false

	v.addEventListener("loadedmetadata", () => {
		console.log("loadedmetadata")
	})

	v.addEventListener("canplay", () => {
		console.log("canplay")
	})

	v.addEventListener("playing", () => {
		console.log("playing")
		playing()
	})

	v.addEventListener("waiting", () => {
		console.log("waiting")
	})

	v.addEventListener("stalled", () => {
		console.log("stalled")
	})

	v.addEventListener("error", () => {
		console.log("error")
		error()

		setTimeout(() => {
			v.reload()
		}, 5_000)

	})

	v.addEventListener("ended", () => {
		console.log("ended")
	})

	return v
}
