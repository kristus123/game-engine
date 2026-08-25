export function Enhance_html_video() {

	Enhance(HTMLVideoElement.prototype, "reload", function () {

		this.pause()
		const old = this.src
		this.removeAttribute("src")
		this.load()

		this.src = old
		this.load()
		this.play() // .catch(() => {})
	})

	Getter(HTMLVideoElement.prototype, "canPlay", function () {
		return this.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA
	})

}
