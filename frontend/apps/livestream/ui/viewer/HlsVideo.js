export function HlsVideo({ playing, error, onPlaybackDate } = {}) {

	const v = `
		<video
			controls
			autoplay
			muted
			playsinline
		></video>
	`.toHtml()

	v.muted = !Permission.canPlayAudio
	v.controls = false
	const source = `${Config.httpUrl}/public_folder/hls/output.m3u8`
	const HlsLibrary = window.Hls
	let hls = null
	let nativePlaylistEndUtc = null
	let nativeDatePoll = null

	const updateNativePlaybackDate = async () => {
		try {
			const response = await fetch(source, { cache: "no-store", signal: AbortSignal.timeout(5_000) })
			if (!response.ok) {
				return
			}

			let currentUtc = null
			let currentDuration = null
			let playlistEndUtc = null
			for (const line of (await response.text()).split(/\r?\n/)) {
				if (line.startsWith("#EXT-X-PROGRAM-DATE-TIME:")) {
					currentUtc = Date.parse(line.slice("#EXT-X-PROGRAM-DATE-TIME:".length))
				}
				else if (line.startsWith("#EXTINF:")) {
					currentDuration = Number.parseFloat(line.slice("#EXTINF:".length))
				}
				else if (line && !line.startsWith("#") && currentDuration != null) {
					if (Number.isFinite(currentUtc) && Number.isFinite(currentDuration)) {
						playlistEndUtc = currentUtc + currentDuration * 1_000
						currentUtc = playlistEndUtc
					}
					currentDuration = null
				}
			}

			if (Number.isFinite(playlistEndUtc)) {
				nativePlaylistEndUtc = playlistEndUtc
			}
		}
		catch (e) {
			console.warn("Could not read native HLS UTC metadata", e)
		}
	}

	if (HlsLibrary?.isSupported()) {
		hls = new HlsLibrary()
		hls.on(HlsLibrary.Events.MEDIA_ATTACHED, () => {
			hls.loadSource(source)
		})
		hls.on(HlsLibrary.Events.MANIFEST_PARSED, () => {
			v.play().catch(() => {})
		})
		hls.on(HlsLibrary.Events.ERROR, (event, data) => {
			if (!data.fatal) {
				return
			}

			error()
			if (data.type == HlsLibrary.ErrorTypes.NETWORK_ERROR) {
				hls.startLoad()
			}
			else if (data.type == HlsLibrary.ErrorTypes.MEDIA_ERROR) {
				hls.recoverMediaError()
			}
			else {
				hls.destroy()
			}
		})

		hls.attachMedia(v)
	}
	else if (v.canPlayType("application/vnd.apple.mpegurl")) {
		v.src = source
		nativeDatePoll = setInterval(updateNativePlaybackDate, 5_000)
		updateNativePlaybackDate()
	}
	else {
		error()
	}

	v.addEventListener("timeupdate", () => {
		if (hls?.playingDate) {
			onPlaybackDate(new Date(hls.playingDate))
		}
		else if (Number.isFinite(nativePlaylistEndUtc) && v.seekable.length > 0) {
			const liveEdge = v.seekable.end(v.seekable.length - 1)
			onPlaybackDate(new Date(nativePlaylistEndUtc + (v.currentTime - liveEdge) * 1_000))
		}
	})

	v.destroyHls = () => {
		if (nativeDatePoll != null) {
			clearInterval(nativeDatePoll)
		}
		hls?.destroy()
		v.pause()
		v.removeAttribute("src")
		v.load()
	}

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
	})

	v.addEventListener("ended", () => {
		console.log("ended")
	})

	return v
}
