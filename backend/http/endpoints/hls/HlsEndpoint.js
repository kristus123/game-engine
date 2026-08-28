import { spawn } from "child_process"

Files.createFolder("public_folder/hls")
Files.deleteFilesInFolder("public_folder/hls")

// Streaming the request body is preferable especially in HLS scenarios
// that we are working on because then you can pipe it directly into FFmpeg,
// but for now we just do it like this

Route.sendChunk = async ({ req, contentType }) => {
	console.log(contentType)
	for await (const chunk of req) {
		await Ffmpeg.write(chunk)
	}

	console.log("done")
}

Route.startStream = async ({ body }) => {
	await Ffmpeg.start(body.mimeType)
}

Route.stopStream = async () => {
	await Ffmpeg.stop()
}

Route.currentlyStreaming = () => {
	return {
		streaming: A.value(Ffmpeg.p),
	}
}
