export async function Swappy() {
	const video = document.createElement("video")
	video.srcObject = null
	video.muted = true
	video.playsInline = true
	video.autoplay = true

	let audioSource = null
	let currentStream = null

	const canvas = document.createElement("canvas")
	canvas.width = 1280
	canvas.height = 720
	const videoOutput = canvas.captureStream(60)
	const ctx = canvas.getContext("2d")

	RequestAnimationFrameLoop(() => {
		if (video.readyState >= 2) {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
		}
	})

	Dom.overlay(canvas)

	const audioContext = new AudioContext()
	await audioContext.resume()
	const audioOutput = audioContext.createMediaStreamDestination()

	return {
		swapStream: async (constraints) => {
			currentStream?.getTracks().forEach(track => track.stop())

			const stream = await navigator.mediaDevices.getUserMedia(constraints)

			video.srcObject = stream

			audioSource?.disconnect()
			audioSource = audioContext.createMediaStreamSource(stream)
			audioSource.connect(audioOutput)

			currentStream = stream

			return stream
		},
		mediaStream: new MediaStream([ // pass it into mediaRecorder
			...videoOutput.getVideoTracks(),
			...audioOutput.stream.getAudioTracks()
		]),
		video: video,
	}

}
