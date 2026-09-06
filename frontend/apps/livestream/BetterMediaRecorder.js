export async function BetterMediaRecorder() {
	const swappableMediaStream = await SwappableMediaStream()
	let mediaRecorder = null

	return {
		video: swappableMediaStream.video,

		start: (onBlob) => {
			Assert.null(mediaRecorder)
			mediaRecorder = new MediaRecorder(swappableMediaStream.mediaStream, { mimeType: Platform.mimeType })

			mediaRecorder.ondataavailable = async e => {
				if (e.data.size > 0) {
					onBlob(e.data)
				}
			}

			mediaRecorder.start(5_000)
		},

		swap: async () => {
			console.log("swag")
			console.log("1")
			await Webcam.request({
				ok: () => {},
				error: () => {},
			})
			console.log("1")
			await Mic.request({
				ok: () => {},
				error: () => {},
			})
			console.log("1")
			console.log("1")

			const devices = await navigator.mediaDevices.enumerateDevices()
			console.log("swag")

			console.log(devices)
			const cameras = devices.filter(device => device.kind == "videoinput")
			const microphones = devices.filter(device => device.kind == "audioinput")

			const camera = cameras[Math.floor(Math.random() * cameras.length)]
			const microphone = microphones[Math.floor(Math.random() * microphones.length)]

			await swappableMediaStream.swap({
				video: camera
					? { deviceId: { exact: camera.deviceId } }
					: false,

				audio: microphone
					? {
						deviceId: { exact: microphone.deviceId },
						echoCancellation: false,
						noiseSuppression: false,
						autoGainControl: false,
					}
					: false,
			})
		},

		stop: async () => {
			if (mediaRecorder) {
				mediaRecorder.stop()
				mediaRecorder = null
			}
			else {
				throw new Error("Can't stop when already stopped")
			}
		},

		isActive: () => {
			return A.value(mediaRecorder)
		},


	}
}
