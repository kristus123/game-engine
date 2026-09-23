UnsecureRoute.uploadFile = ({ body, req }) => {
	const type = req.headers["content-type"] || ""

	const senderId = req.headers["x-client-id"]
	const filename = crypto.randomUUID()

	if (type.includes("application/json")) {
		FileDb.saveFile(`${senderId}/${filename}`, body)
		return { status: "server success" }
	}
	else if (type.startsWith("audio/") || type == "application/octet-stream") {
		const ext = type.split("/")[1] || "bin"
		const path = `${senderId}/${filename}.${ext}`

		FileDb.saveFile(path, body)

		return {
			status: "server success (audio)",
			path,
		}
	}
	else {
		throw new Error("unexpected: " + type)
	}
}

UnsecureRoute.readFile = ({ body }) => {
	return FileDb.getFile(body.filename)
}

UnsecureRoute.readFiles = ({ body }) => {
	return FileDb.getFilesInFolder(body.folder)
}

UnsecureRoute.deleteFile = ({ body }) => {
	return FileDb.deleteFile(body.filename)
}
