export class MicApi {

	// IMPORTANT:
	// stop all microphone tracks so the browser
	// completely releases the microphone
	static stopTracks(stream) {
		stream.getTracks().forEach(track => {
			track.stop()
		})
	}

	static async createStream() {
		return await navigator.mediaDevices.getUserMedia({
			audio: {
				deviceId: {
					ideal: ActiveMic.selected ?? undefined, // use deviceId // exact or ideal field //seems i need to use undefined
				},
				echoCancellation: false,
				noiseSuppression: false,
				autoGainControl: false,
				channelCount: 1,
				// sampleRate: 48000,   // optional - browser may ignore
				// sampleSize: 16,      // optional - browser may ignore
				// latency: 0.01        // optional - browser may ignore
			},
		})

	}

}
