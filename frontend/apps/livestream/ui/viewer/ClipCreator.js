export class ClipCreator {
	static async create(playbackUtc) { // no-null-check
		const clipTab = window.open("about:blank", "_blank")
		if (!clipTab) {
			throw new Error("Allow pop-ups to open the clip")
		}

		if (!playbackUtc) {
			clipTab.close()
			throw new Error("Waiting for UTC playback time")
		}

		try {
			const response = await JsonHttpClient.makeTwitchClip({
				body: {
					endUtc: playbackUtc.toISOString(),
					durationSeconds: 30,
				},
				timeoutMs: 120_000,
			})
			const clip = await Assert.ok(response)
			clipTab.opener = null
			clipTab.location.href = `${Config.httpUrl}/${clip.path}`
		}
		catch (e) {
			clipTab.document.title = "Clip unavailable"
			clipTab.document.body.textContent = `Could not make clip: ${e.message}`
			clipTab.opener = null
			console.error(e)
			throw e
		}
	}
}
