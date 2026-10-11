export function Enhance_html_video() {

	Enhance(HTMLVideoElement.prototype, "mirror", function () {
		this.style.transform = "scaleX(-1)"
		return this
	})

	Enhance(HTMLVideoElement.prototype, "reload", function () {

		this.pause()
		const old = this.src
		this.removeAttribute("src")
		this.load()

		this.src = old
		this.load()
		this.play() // .catch(() => {})

		return this
	})

	Getter(HTMLVideoElement.prototype, "canPlay", function () {
		return this.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA
	})

	Getter(HTMLVideoElement.prototype, "canPlayHls", function () {
		return this.canPlayType("application/vnd.apple.mpegurl")
	})

	Getter(HTMLVideoElement.prototype, "canPlayHls", function () {
		return this.canPlayType("application/vnd.apple.mpegurl")
	})

	Getter(HTMLVideoElement.prototype, "isPlaying", function () {
		return !video.paused && !video.ended && video.readyState > 2
	})

}
