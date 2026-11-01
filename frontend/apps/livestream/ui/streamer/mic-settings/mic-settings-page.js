export const page = {
	persistOnClose: false,
}

export default ({ html }) => {
	const methods = {
		loadMicrophones: async () => {
			html.micList.clearChildren()
			html.micStatus.textContent = "Checking microphone access…"
			try {
				if !Permission.granted {
					await Permission.request()
				}
				const microphones = await Mic.all()
				const activeDeviceId = Stream.audioDeviceId
				if microphones.length == 0 {
					html.micList.add(H.p("No microphones found. Connect one and refresh the list."))
					html.micStatus.textContent = "No microphone inputs are available to this browser."
					return
				}
				for const [index, microphone] of microphones.entries() {
					const row = document.createElement("label")
					const radio = H.radio({
						name: "livestreamMicrophone",
						value: microphone.deviceId,
						checked: activeDeviceId == microphone.deviceId,
						onChange: () => methods.applyMicSelection(),
					})
					radio.dataset.deviceId = microphone.deviceId
					radio.dataset.deviceLabel = microphone.label || `Microphone ${index + 1}`
					row.append(radio, H.span(microphone.label || `Microphone ${index + 1}`))
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
		},
		applyMicSelection: async () => {
			const radios = [...html.micList.querySelectorAll("input[type=radio]")]
			for const radio of radios {
				radio.disabled = true
			}
			html.clearMic.disabled = true
			html.micStatus.content = "Updating microphones…"
			try {
				const selectedRadio = radios.find(radio => radio.checked)
				const selectedDeviceId = selectedRadio?.dataset.deviceId ?? null
				const activeDeviceId = Stream.audioDeviceId
				if selectedRadio && !selectedDeviceId {
					throw new Error(`Selected microphone has no device ID: ${selectedRadio.dataset.deviceLabel}`)
				}
				if selectedDeviceId && selectedDeviceId != activeDeviceId {
					await Stream.setAudioDevice(selectedDeviceId)
				}
				else if !selectedDeviceId && activeDeviceId {
					Stream.clearAudioDevice()
				}
				if Stream.audioDeviceId != selectedDeviceId {
					throw new Error("Microphone selection did not take effect.")
				}
				html.micStatus.content = selectedDeviceId
					? `Microphone active: ${selectedRadio.dataset.deviceLabel || selectedDeviceId}.`
					: "No microphone selected. Livestream audio will be muted."
			}
			catch (error) {
				const activeDeviceId = Stream.audioDeviceId
				for const radio of radios {
					radio.checked = radio.dataset.deviceId == activeDeviceId
				}
				const message = error instanceof Error ? error.message : String(error)
				html.micStatus.content = `Could not update microphones: ${message}`
				throw error
			}
			finally {
				for const radio of radios {
					radio.disabled = false
				}
				html.clearMic.disabled = false
			}
		},
		clearMic: async () => {
			for const radio of html.micList.querySelectorAll("input[type=radio]") {
				radio.checked = false
			}
			await methods.applyMicSelection()
		},
	}
	return {
		methods,
		onPageOpen: () => methods.loadMicrophones(),
	}
}
