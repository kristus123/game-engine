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
		return this.canPlayType("application/vnd.apple.mpegurl") != ""
	})

	Getter(HTMLVideoElement.prototype, "isPlaying", function () {
		return !this.paused && !this.ended && this.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA
	})

	Enhance(HTMLVideoElement.prototype, "getSeekTarget", function (seconds) {
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
	})

	Enhance(HTMLVideoElement.prototype, "seekBy", function (seconds) {
		const target = this.getSeekTarget(seconds)
		if (target == null) {
			return
		}

		this.currentTime = target
	})

}
