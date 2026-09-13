export class MediaDevices {

	static async audio(deviceId) {
		return await navigator.mediaDevices.getUserMedia({
			audio: {
				deviceId: {
					exact: deviceId,
				},
				echoCancellation: false,
				noiseSuppression: false,
				autoGainControl: false,
			},
		})
	}

	static async video(deviceId) {
		return await navigator.mediaDevices.getUserMedia({
			video: {
				deviceId: {
					exact: deviceId,
				},
			},
		})
	}
}
