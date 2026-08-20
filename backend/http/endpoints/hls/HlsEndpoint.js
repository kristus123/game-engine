import { spawn } from "child_process"

Files.deleteFilesInFolder("public_folder/hls")


Route.sendChunk = async ({ bufferBody }) => {
	// we should stream body into ffmpeg without first wrapping it.
	// but that can be done later
	console.log(Buffer.isBuffer(bufferBody), bufferBody.length)

	await Ffmpeg.write(bufferBody)

	return {
		ok: true,
	}
}

Route.startStream = async () => {
	await Ffmpeg.start()

	return {
		started: true,
	}
}

Route.stopStream = async () => {
	await Ffmpeg.stop()

	return {
		stopped: true,
	}
}


Route.currentlyStreaming = () => {
	return {
		streaming: A.value(Ffmpeg.p),
	}
}
