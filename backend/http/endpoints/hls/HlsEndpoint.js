Files.createFolder("public_folder/hls")
Files.deleteFilesInFolder("public_folder/hls")

UnsecureRoute.sendChunk = async ({ req }) => {
	for await (const chunk of req) {
		await Ffmpeg.write(chunk)
	}
}

UnsecureRoute.startStream = async ({ body }) => {
	await Ffmpeg.start(body.mimeType)
}

UnsecureRoute.stopStream = async () => {
	await Ffmpeg.stop()
	Files.deleteFilesInFolder("public_folder/hls")
}

UnsecureRoute.streamOnline = () => {
	return {
		online: A.value(Ffmpeg.p), // hack
	}
}
