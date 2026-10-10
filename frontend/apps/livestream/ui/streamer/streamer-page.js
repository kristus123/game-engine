export default async ({ html }) => {
	let isPreviewingStream = false
	const streamPreview = document.createElement("video")
	streamPreview.autoplay = false
	streamPreview.playsInline = true
	streamPreview.muted = false
	streamPreview.srcObject = SwappableMediaStream.stream
	streamPreview.css("width: 100%; height: 100%; object-fit: contain; background: black; pointer-events: none;")

	if (await Stream.online()) {
		html.waiting.content = "someone is already streaming"
		html.stop.show()
	}
	else {
		html.waiting.content = "Stream not online"
		html.start.show()
	}

	try {
		await Permission.request()
	}
	catch (error) {
		console.warn("Microphone access is not available yet", error)
	}

	const chatQueue = PromiseQueue()
	Chat.onMessage(({ user, message }) => {
		chatQueue.add(() => Tts(message))
	})

	OtherUsers.onCountChange(c => {
		console.log("updating viewcount baby")
		html.viewCount.content = c
	})

	const cams = Permission.granted ? await Cam.all() : []

	return {
		onDisconnected: () => {
			streamPreview.pause()
			isPreviewingStream = false
			html.videoOverlay.clearChildren()
			html.previewToggle.content = "Preview media stream"
			html.previewToggle.title = ""
		},
		onDestroy: () => {
			streamPreview.pause()
			streamPreview.srcObject = null
		},
		methods: {
			openMicSettings: async () => {
				html.micSettings.show()
				await loadMicrophones()
			},
			refreshMicrophones: async () => {
				await loadMicrophones()
			},
			clearMic: async () => {
				for (const radio of html.micList.querySelectorAll("input[type=radio]")) {
					radio.checked = false
				}
				await applyMicSelection()
			},
			selectNextCam: async () => {
				await Stream.swapVideo(cams.nextElementCyclic().deviceId)
			},
			togglePreview: async () => {
				if (isPreviewingStream) {
					isPreviewingStream = false
					streamPreview.pause()
					showCameraPreview()
					html.previewToggle.content = "Preview media stream"
					return
				}

				isPreviewingStream = true
				html.previewToggle.content = "Preview camera"
				html.previewToggle.title = ""
				html.videoOverlay.clearChildren()
				html.videoOverlay.add(streamPreview)

				try {
					const resumeAudio = SwappableMediaStream.audioContext.resume()
					const startVideo = streamPreview.play()
					await Promise.all([resumeAudio, startVideo])
				}
				catch (error) {
					isPreviewingStream = false
					streamPreview.pause()
					showCameraPreview()
					html.previewToggle.content = "Preview media stream"
					const message = error instanceof Error ? error.message : String(error)
					html.previewToggle.title = `Could not play stream preview: ${message}`
					console.warn("Could not play the outgoing livestream preview", error)
				}
			},
			startStream: async () => {
				html.waiting.content = ""

				await Stream.start()
				if (!isPreviewingStream) {
					showCameraPreview()
				}

				html.start.hide()
				html.stop.show()
			},
			stopStream: async () => {
				streamPreview.pause()
				isPreviewingStream = false
				html.videoOverlay.clearChildren()
				await Stream.stop()
				html.previewToggle.content = "Preview media stream"
				html.previewToggle.title = ""

				html.start.show()
				html.stop.hide()
			},
		},
	}

	function showCameraPreview() {
		html.videoOverlay.clearChildren()
		html.videoOverlay.add(SwappableMediaStream.video.mirror())
	}

	async function loadMicrophones() {
		html.micList.clearChildren()
		html.micStatus.textContent = "Checking microphone access…"

		try {
			if (!Permission.granted) {
				await Permission.request()
			}

			const microphones = await Mic.all()
			const activeDeviceId = Stream.audioDeviceId

			if (microphones.length == 0) {
				html.micList.add(H.p("No microphones found. Connect one and refresh the list."))
				html.micStatus.textContent = "No microphone inputs are available to this browser."
				return
			}

			for (const [index, microphone] of microphones.entries()) {
				const row = document.createElement("label")
				row.className = "microphone-option"

				const radio = document.createElement("input")
				radio.type = "radio"
				radio.name = "livestreamMicrophone"
				radio.dataset.deviceId = microphone.deviceId
				radio.dataset.deviceLabel = microphone.label || `Microphone ${index + 1}`
				radio.checked = activeDeviceId == microphone.deviceId
				radio.addEventListener("change", applyMicSelection)

				const label = H.span(microphone.label || `Microphone ${index + 1}`, "microphone-option__label")

				row.append(radio, label)
				html.micList.add(row)
			}

			html.micStatus.textContent = microphones.length == 1
				? "Changes apply immediately. One microphone is available."
				: `Changes apply immediately. ${microphones.length} microphones are available; one can be active.`
		}
		catch (error) {
			html.micList.add(H.p("Microphone devices could not be loaded. Check browser permissions and refresh."))
			const message = error instanceof Error ? error.message : String(error)
			html.micStatus.textContent = `Microphone access failed: ${message}`
		}
	}

	async function applyMicSelection() {
		const radios = [...html.micList.querySelectorAll("input[type=radio]")]
		for (const radio of radios) {
			radio.disabled = true
		}
		html.clearMic.disabled = true
		html.micStatus.content = "Updating microphones…"

		try {
			const selectedRadio = radios.find(radio => radio.checked)
			const selectedDeviceId = selectedRadio?.dataset.deviceId ?? null
			const activeDeviceId = Stream.audioDeviceId

			if (selectedRadio && !selectedDeviceId) {
				throw new Error(`Selected microphone has no device ID: ${selectedRadio.dataset.deviceLabel}`)
			}

			if (selectedDeviceId && selectedDeviceId != activeDeviceId) {
				const label = selectedRadio.dataset.deviceLabel || selectedDeviceId
				await updateMicrophone("select", label, () => Stream.setAudioDevice(selectedDeviceId))
			}
			else if (!selectedDeviceId && activeDeviceId) {
				await updateMicrophone("deselect", activeDeviceId, () => Stream.clearAudioDevice())
			}

			if (Stream.audioDeviceId != selectedDeviceId) {
				throw new Error("Microphone selection did not take effect.")
			}

			html.micStatus.content = selectedDeviceId
				? `Microphone active: ${selectedRadio.dataset.deviceLabel || selectedDeviceId}.`
				: "No microphone selected. Livestream audio will be muted."
		}
		catch (error) {
			const activeDeviceId = Stream.audioDeviceId
			for (const radio of radios) {
				radio.checked = radio.dataset.deviceId == activeDeviceId
			}
			const message = error instanceof Error ? error.message : String(error)
			html.micStatus.content = `Could not update microphones: ${message}`
			throw error
		}
		finally {
			for (const radio of radios) {
				radio.disabled = false
			}
			html.clearMic.disabled = false
		}
	}

	async function updateMicrophone(action, label, update) {
		try {
			await update()
		}
		catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			const wrappedError = new Error(`Failed to ${action} microphone "${label}": ${message}`)
			wrappedError.cause = error
			throw wrappedError
		}
	}
}
