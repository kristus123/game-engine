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

	getSeekTarget(seconds) {
		const seekable = this.seekable
		if (!Number.isFinite(seconds) || seconds == 0 || seekable.length == 0) {
			return null
		}

		const currentTime = this.currentTime
		const requestedTime = currentTime + seconds
		let target = null
		let closestDistance = Infinity
		for (let index = 0; index < seekable.length; index++) {
			const start = seekable.start(index)
			// Stay inside the range so reaching the live edge does not end playback.
			const end = Math.max(start, seekable.end(index) - 0.1)
			const candidate = Math.max(start, Math.min(requestedTime, end))
			const distance = Math.abs(candidate - requestedTime)
			if (distance < closestDistance) {
				target = candidate
				closestDistance = distance
			}
		}

		if (target == null || Math.abs(target - currentTime) < 0.1 || (target - currentTime) * seconds <= 0) {
			return null
		}
		return target
	}

	seekBy(seconds) {
		const target = this.getSeekTarget(seconds)
		if (target == null) {
			return
		}

		this.currentTime = target
	}

}
