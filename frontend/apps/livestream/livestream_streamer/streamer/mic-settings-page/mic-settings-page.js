export default {
	page: { persistOnClose: false },
	fields: () => ({ radios: [] }),
	methods: {
		applyMicSelection: async (html) => {
			const radios = html.fields.radios
			for const radio of radios {
				radio.disabled = true
			}

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
				if Stream.audioDeviceId != selectedDeviceId {
					throw new Error("Microphone selection did not take effect.")
				}
				html.micStatus.content = selectedDeviceId
					? `Microphone active: ${selectedRadio.dataset.deviceLabel || selectedDeviceId}.`
					: "Select a microphone to use for the livestream."
			}
			catch (error) {
				const activeDeviceId = Stream.audioDeviceId
				for const radio of radios {
					radio.checked = radio.dataset.deviceId == activeDeviceId
				}
				const message = error instanceof Error ? error.message : String(error)
				html.micStatus.content = `Could not update microphones: ${message}`
			}
			finally {
				for const radio of radios {
					radio.disabled = false
				}
			}
		},
	},
	onDomAdd: async ({ html }) => {
		html.fields.radios = []
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
				onSelect: async () => (await html.whenReady()).methods.applyMicSelection(),
			})
			html.fields.radios.push(radio.input)
			html.micList.add(radio)
		}
		if !mics.empty {
			html.micStatus.content = "Select a microphone to use for the livestream."
		}
	},
}
