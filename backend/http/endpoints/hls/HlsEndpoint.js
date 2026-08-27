import { spawn } from "child_process"

Files.createFolder("public_folder/hls")
Files.deleteFilesInFolder("public_folder/hls")

// Streaming the request body is preferable especially in HLS scenarios
// that we are working on because then you can pipe it directly into FFmpeg,
// but for now we just do it like this

Route.sendChunk = async ({ body }) => {
	// we should stream body into ffmpeg without first wrapping it with bufferBody
	// but that can be done later

	await Ffmpeg.write(body)
}

Route.startStream = async () => {
	await Ffmpeg.start()
}

Route.stopStream = async () => {
	await Ffmpeg.stop()
}

Route.currentlyStreaming = () => {
	return {
		streaming: A.value(Ffmpeg.p),
	}
}
