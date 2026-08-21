export function Enhance_html_video() {

	Enhance(HTMLVideoElement.prototype, "reloadSrc", function () {
		const old = this.src

		this.src = ""
		this.load()

		this.src = old
		this.load()

		return this.play().catch(() => {})
	})

	Getter(HTMLVideoElement.prototype, "canPlay", function () {
		return this.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA
	})

}
