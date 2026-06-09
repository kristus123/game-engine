export class MicApi {

	static permissionGiven = false

	static askPermission(callback) {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then(stream => {
				stream.getTracks().forEach(track => track.stop())

				callback(this.permissionGiven = true)
			})
			.catch(e => {
				console.error(e)

				callback(this.permissionGiven = false)
			})
	}

	static createStream() {
		return navigator.mediaDevices.getUserMedia({
			audio: {
				deviceId: {
					ideal: this.selected ?? undefined, // use deviceId // exact or ideal field //seems i need to use undefined
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
