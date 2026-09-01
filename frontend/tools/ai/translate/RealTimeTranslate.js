export class RealTimeTranslate {

	static translatedAudio = new Audio()
	static translatedText = ""

	static {
		this.translatedAudio.autoplay = true
	}

	static async start() {

		const response = await fetch(
			"https://api.openai.com/v1/realtime/translations/client_secrets",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${OpenAiToken}`,
					"Content-Type": "application/json",
					"OpenAI-Safety-Identifier": "hashed-user-id",
				},
				body: JSON.stringify({
					session: {
						  model: "gpt-realtime-translate",
						  audio: {
							  output: { language: "zh" }, // es
						  },
					},
				}),
			}
		)

		const json = await response.json()
		const clientSecret = json.value

		const sourceStream = await navigator.mediaDevices.getUserMedia({
			audio: true,
		})

		const pc = new RTCPeerConnection()
		pc.addTrack(sourceStream.getAudioTracks()[0], sourceStream)
		pc.onconnectionstatechange = () => {
			console.log("Connection:", pc.connectionState)

			if (pc.connectionState == "failed" || pc.connectionState == "disconnected" || pc.connectionState == "closed") {
				console.log("todo handle")
			}
		}

		pc.oniceconnectionstatechange = () => {
			console.log("ICE:", pc.iceConnectionState)
		}

		pc.ontrack = ({ streams }) => {
			this.translatedAudio.srcObject = streams[0]
		}

		let lastMs = 0

		const events = pc.createDataChannel("oai-events")

		events.onmessage = ({ data }) => {
			const e = JSON.parse(data)
			if (e.elapsed_ms > lastMs + 1_000) {
				this.translatedText = ""
			}
			if (e.type == "session.output_transcript.delta") {
			  this.translatedText += e.delta
			}
			lastMs = e.elapsed_ms

			console.log(this.translatedText)
		}

		events.onclose = () => {
			console.log("Data channel closed")
		}

		events.onerror = error => {
			console.error("Data channel error", error)
		}

		const offer = await pc.createOffer()
		await pc.setLocalDescription(offer)

		const sdpResponse = await fetch(
			"https://api.openai.com/v1/realtime/translations/calls",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${clientSecret}`,
					"Content-Type": "application/sdp",
				},
				body: offer.sdp,
			}
		)

		if (sdpResponse.ok) {
			await pc.setRemoteDescription({
				type: "answer",
				sdp: await sdpResponse.text(),
			})
		}
		else {
			throw new Error(await sdpResponse.text())
		}
	}

	static stop() {
		if (this.translatedAudio) {
			this.translatedAudio.srcObject = null
		}

		if (this.events) {
			this.events.close()
			this.events = null
		}

		if (this.pc) {
			this.pc.close()
			this.pc = null
		}
	}

}
