export default async ({ html }) => {

	if (await Stream.online()) {
		html.waiting.content = "someone is already streaming"
		html.stop.show()
	}
	else {
		html.waiting.content = "Stream not online"
		html.start.show()
	}

	await Permission.request()

	const chatQueue = PromiseQueue()
	Chat.onMessage(({ user, message }) => {
		chatQueue.add(() => Tts(message))
	})

	OtherUsers.onCountChange(c => {
		console.log("updating viewcount baby")
		html.viewCount.content = c
	})

	const cams = await Cam.all()

	return {
		onDestroy: () => {},
		methods: {
			openMicSettings: async () => {
				html.micList.clearChildren()
				html.micSettings.show()

				const microphones = await Mic.all()
				const activeDeviceIds = new Set(Stream.audioDeviceIds)

				if (microphones.length == 0) {
					html.micList.add(H.p("No microphones found."))
				}

				for (const [index, microphone] of microphones.entries()) {
					const row = document.createElement("label")
					row.css("display: flex; align-items: center; gap: 12px; padding: 12px; font-size: 20px; text-align: left;")

					const checkbox = H.checkbox()
					checkbox.dataset.deviceId = microphone.deviceId
					checkbox.checked = activeDeviceIds.has(microphone.deviceId)
					checkbox.css("width: 24px; height: 24px; flex: none;")
					checkbox.OnChange(applyMicSelection)

					const label = H.span(microphone.label || `Microphone ${index + 1}`)

					row.append(checkbox, label)
					html.micList.add(row)
				}

				html.micStatus.content = microphones.length == 0
					? "Connect a microphone to use it in the livestream."
					: "Changes apply immediately. Select more than one to mix microphones."
			},
			clearMics: async () => {
				for (const checkbox of html.micList.querySelectorAll("input[type=checkbox]")) {
					checkbox.checked = false
				}
				await applyMicSelection()
			},
			selectNextCam: async () => {
				await Stream.swapVideo(cams.nextElementCyclic().deviceId)
			},
			startStream: async () => {
				html.waiting.content = ""

				await Stream.start()
				html.videoOverlay.clearChildren()
				html.videoOverlay.add(SwappableMediaStream.video.mirror())

				html.start.hide()
				html.stop.show()
			},
			stopStream: async () => {
				html.videoOverlay.clearChildren()
				await Stream.stop()

				html.start.show()
				html.stop.hide()
			},
		},
	}

	async function applyMicSelection() {
		const checkboxes = [...html.micList.querySelectorAll("input[type=checkbox]")]
		for (const checkbox of checkboxes) {
			checkbox.disabled = true
		}
		html.clearMics.disabled = true
		html.micStatus.content = "Updating microphones…"

		try {
			const selectedDeviceIds = new Set(checkboxes
				.filter(checkbox => checkbox.checked)
				.map(checkbox => checkbox.dataset.deviceId))
			const activeDeviceIds = new Set(Stream.audioDeviceIds)

			for (const deviceId of selectedDeviceIds) {
				if (!activeDeviceIds.has(deviceId)) {
					await Stream.addAudioDevice(deviceId)
				}
			}

			for (const deviceId of activeDeviceIds) {
				if (!selectedDeviceIds.has(deviceId)) {
					Stream.removeAudioDevice(deviceId)
				}
			}

			const activeCount = Stream.audioDeviceIds.length

			html.micStatus.content = activeCount == 0
				? "No microphones selected. Livestream audio will be muted."
				: `${activeCount} microphone${activeCount == 1 ? "" : "s"} active.`
		}
		catch (error) {
			const activeDeviceIds = new Set(Stream.audioDeviceIds)
			for (const checkbox of checkboxes) {
				checkbox.checked = activeDeviceIds.has(checkbox.dataset.deviceId)
			}
			html.micStatus.content = `Could not update microphones: ${error.message}`
		}
		finally {
			for (const checkbox of checkboxes) {
				checkbox.disabled = false
			}
			html.clearMics.disabled = false
		}
	}
}
