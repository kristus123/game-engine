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
	const chaosFeature = "VIEWER_HLS"
	let hls = null
	let isDestroyed = false
	let isNativeHlsStarted = false
	let nativePlaylistEndUtc = null
	let nativeDatePoll = null
	let nativePollInProgress = false
	let nativeRetryTimer = null
	let nativeRetryAttempts = 0
	let recoveryTimer = null
	let recoveryAttempts = 0

	const reportError = () => {
		try {
			error?.()
		}
		catch (e) {
			console.error("HLS error callback failed", e)
		}
	}

	const reportPlaybackDate = date => {
		try {
			onPlaybackDate?.(date)
		}
		catch (e) {
			console.error("HLS playback date callback failed", e)
		}
	}

	const updateNativePlaybackDate = async () => {
		if (isDestroyed || nativePollInProgress) {
			return
		}

		nativePollInProgress = true
		try {
			ChaosMonkey.maybeCrash({
				feature: chaosFeature,
				message: "native HLS metadata poll",
				chance: 0.05,
			})

			const response = await fetch(source, { cache: "no-store", signal: AbortSignal.timeout(5_000) })
			if (!response.ok || isDestroyed) {
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

			if (!isDestroyed && Number.isFinite(playlistEndUtc)) {
				nativePlaylistEndUtc = playlistEndUtc
			}
		}
		catch (e) {
			console.warn("Could not read native HLS UTC metadata; will retry", e)
		}
		finally {
			nativePollInProgress = false
		}
	}

	const useNativeHls = () => {
		if (isDestroyed || isNativeHlsStarted) {
			return
		}

		if (!v.canPlayType("application/vnd.apple.mpegurl")) {
			reportError()
			return
		}

		isNativeHlsStarted = true
		v.src = source
		nativeDatePoll = setInterval(updateNativePlaybackDate, 5_000)
		updateNativePlaybackDate()
	}

	const scheduleNativeRetry = () => {
		if (!isNativeHlsStarted || isDestroyed || nativeRetryTimer != null) {
			return
		}

		if (nativeRetryAttempts >= 3) {
			reportError()
			return
		}

		const attempt = nativeRetryAttempts
		nativeRetryAttempts += 1
		const backoffMs = Math.min(1_000 * 2 ** attempt, 8_000)
		nativeRetryTimer = setTimeout(async () => {
			nativeRetryTimer = null
			if (isDestroyed || !isNativeHlsStarted) {
				return
			}

			try {
				await ChaosMonkey.delay({ feature: chaosFeature, minMs: 0, maxMs: 250 })
				ChaosMonkey.maybeCrash({
					feature: chaosFeature,
					message: "native HLS retry",
					chance: 0.1,
				})
				v.src = source
				v.load()
				v.play().catch(() => {})
			}
			catch (e) {
				console.warn("Native HLS retry failed; scheduling another", e)
				scheduleNativeRetry()
			}
		}, backoffMs)
	}

	const clearRecoveryTimer = () => {
		if (recoveryTimer != null) {
			clearTimeout(recoveryTimer)
			recoveryTimer = null
		}
	}

	const switchToNativeHls = () => {
		if (isDestroyed) {
			return
		}

		clearRecoveryTimer()
		const currentHls = hls
		hls = null
		currentHls?.destroy()

		if (v.canPlayType("application/vnd.apple.mpegurl")) {
			v.removeAttribute("src")
			v.load()
			useNativeHls()
		}
		else {
			reportError()
		}
	}

	const scheduleRecovery = (player, errorType, HlsLibrary) => {
		if (isDestroyed || player != hls || recoveryTimer != null) {
			return
		}

		const isRecoverable = errorType == HlsLibrary.ErrorTypes.NETWORK_ERROR
			|| errorType == HlsLibrary.ErrorTypes.MEDIA_ERROR
		if (!isRecoverable || recoveryAttempts >= 3) {
			switchToNativeHls()
			return
		}

		const attempt = recoveryAttempts
		recoveryAttempts += 1
		const backoffMs = Math.min(500 * 2 ** attempt, 4_000)
		recoveryTimer = setTimeout(async () => {
			recoveryTimer = null
			if (isDestroyed || player != hls) {
				return
			}

			try {
				await ChaosMonkey.delay({ feature: chaosFeature, minMs: 0, maxMs: 250 })
				ChaosMonkey.maybeCrash({
					feature: chaosFeature,
					message: "HLS recovery attempt",
					chance: 0.1,
				})

				if (errorType == HlsLibrary.ErrorTypes.NETWORK_ERROR) {
					player.startLoad()
				}
				else {
					player.recoverMediaError()
				}
			}
			catch (e) {
				console.warn("HLS recovery attempt failed; scheduling another", e)
				scheduleRecovery(player, errorType, HlsLibrary)
			}
		}, backoffMs)
	}

	const loadHlsLibrary = async () => {
		try {
			return await Retry(3, async () => {
				if (isDestroyed) {
					return null
				}

				await ChaosMonkey.delay({ feature: chaosFeature, minMs: 0, maxMs: 500 })
				if (isDestroyed) {
					return null
				}

				const HlsModule = await import("https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.mjs")
				if (!HlsModule.default) {
					throw new Error("hls.js module has no default export")
				}

				return HlsModule.default
			}, {
				feature: chaosFeature,
				message: "hls.js module load",
				delayMs: 250,
				maxDelayMs: 1_000,
			})
		}
		catch (e) {
			console.warn("Could not load hls.js after retries", e)
			return null
		}
	}

	const startPlayback = async () => {
		const HlsLibrary = await loadHlsLibrary()
		if (isDestroyed) {
			return
		}

		if (!HlsLibrary?.isSupported()) {
			useNativeHls()
			return
		}

		try {
			hls = new HlsLibrary({
				workerPath: "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.worker.js",
			})
			const currentHls = hls

			const loadSourceWithRetry = async () => {
				if (isDestroyed || currentHls != hls) {
					return
				}

				try {
					await Retry(3, async () => {
						if (isDestroyed || currentHls != hls) {
							return
						}

						await ChaosMonkey.delay({ feature: chaosFeature, minMs: 0, maxMs: 400 })
						if (isDestroyed || currentHls != hls) {
							return
						}

						currentHls.loadSource(source)
					}, {
						feature: chaosFeature,
						message: "HLS source setup",
						delayMs: 250,
						maxDelayMs: 1_000,
					})
				}
				catch (e) {
					console.warn("HLS source setup failed after retries", e)
					switchToNativeHls()
				}
			}

			currentHls.on(HlsLibrary.Events.MEDIA_ATTACHED, () => {
				loadSourceWithRetry()
			})
			currentHls.on(HlsLibrary.Events.MANIFEST_PARSED, () => {
				v.play().catch(() => {})
			})
			currentHls.on(HlsLibrary.Events.ERROR, (event, data) => {
				if (!data?.fatal || currentHls != hls) {
					return
				}

				reportError()
				scheduleRecovery(currentHls, data.type, HlsLibrary)
			})

			currentHls.attachMedia(v)
		}
		catch (e) {
			console.error("Could not start hls.js playback", e)
			switchToNativeHls()
		}
	}

	startPlayback().catch(e => {
		console.error("Unexpected HLS startup failure", e)
		switchToNativeHls()
	})

	v.addEventListener("timeupdate", () => {
		if (hls?.playingDate) {
			reportPlaybackDate(new Date(hls.playingDate))
		}
		else if (Number.isFinite(nativePlaylistEndUtc) && v.seekable.length > 0) {
			const liveEdge = v.seekable.end(v.seekable.length - 1)
			reportPlaybackDate(new Date(nativePlaylistEndUtc + (v.currentTime - liveEdge) * 1_000))
		}
	})

	v.destroyHls = () => {
		isDestroyed = true
		clearRecoveryTimer()
		if (nativeRetryTimer != null) {
			clearTimeout(nativeRetryTimer)
			nativeRetryTimer = null
		}
		if (nativeDatePoll != null) {
			clearInterval(nativeDatePoll)
			nativeDatePoll = null
		}
		hls?.destroy()
		hls = null
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
		recoveryAttempts = 0
		clearRecoveryTimer()
		nativeRetryAttempts = 0
		if (nativeRetryTimer != null) {
			clearTimeout(nativeRetryTimer)
			nativeRetryTimer = null
		}
		try {
			playing?.()
		}
		catch (e) {
			console.error("HLS playing callback failed", e)
		}
	})

	v.addEventListener("waiting", () => {
		console.log("waiting")
	})

	v.addEventListener("stalled", () => {
		console.log("stalled")
	})

	v.addEventListener("error", () => {
		console.log("error")
		reportError()
		scheduleNativeRetry()
	})

	v.addEventListener("ended", () => {
		console.log("ended")
	})

	return v
}
