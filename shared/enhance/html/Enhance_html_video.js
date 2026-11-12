export class Enhance_html_video extends NativeEnhancer {

	constructor() {
		super(HTMLVideoElement.prototype)
	}

	mirror() {
		this.style.transform = "scaleX(-1)"
		return this
	}

	reload() {

		this.pause()
		const old = this.src
		this.removeAttribute("src")
		this.load()

		this.src = old
		this.load()
		this.play() // .catch(() => {})

		return this
	}

	get canPlay() {
		return this.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA
	}

	get canPlayHls() {
		return this.canPlayType("application/vnd.apple.mpegurl") != ""
	}

	get isPlaying() {
		return !this.paused && !this.ended && this.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA
	}


}
