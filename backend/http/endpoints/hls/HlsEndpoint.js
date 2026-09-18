Files.createFolder("public_folder/hls")
Files.deleteFilesInFolder("public_folder/hls")

Route.sendChunk = async ({ req }) => {
	for await (const chunk of req) {
		await Ffmpeg.write(chunk)
	}
}

Route.startStream = async ({ body }) => {
	await Ffmpeg.start(body.mimeType)
}

Route.stopStream = async () => {
	await Ffmpeg.stop()
}

Route.currentlyStreaming = () => {
	return {
		streaming: A.value(Ffmpeg.p), // hack
	}
}
