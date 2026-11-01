export const page = {
	persistOnClose: false,
}

export default ({ html }) => {
	let radios = []

	const methods = {
		applyMicSelection: async () => {
			for const radio of radios {
				radio.disabled = true
			}

			html.muteMic.disabled = true
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
				html.muteMic.disabled = false
			}
		},
		muteMic: async () => {
			for const radio of radios {
				radio.checked = false
			}
			await methods.applyMicSelection()
		},
	}
	return {
		methods,
		onPageOpen: async () => {
			radios = []

			html.micList.clearChildren()
			html.micStatus.textContent = "Checking microphone access…"

			await Permission.request()

			const mics = await Mic.all()
			if mics.empty {
				html.micStatus.textContent = "No microphone inputs are available to this browser."
			}

			for const [index, mic] of mics.entries() {
				const radio = H.radio({
					data: {
						deviceId: mic.deviceId,
						deviceLabel: mic.label || `Microphone ${index + 1}`,
					},
					name: "livestreamMicrophone",
					value: mic.deviceId,
					text: mic.label || `Microphone ${index + 1}`,
					checked: Stream.audioDeviceId == mic.deviceId,
						onSelect: () => methods.applyMicSelection(),
				})
				radios.push(radio.input)
				html.micList.add(radio)
			}
		},
	}
}
