import { FileDb } from "#root/server/http/FileDb.js"
import { Methods } from "#root/server/http/Methods.js"

Methods.add("uploadFile", ({ body, req }) => {
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
		throw new Error("xxxxxxxxxxx")
	}
})

Methods.add("readFile", ({ body }) => {
	return FileDb.getFile(body.filename)
})

Methods.add("readFiles", ({ body }) => {
	return FileDb.getFilesInFolder(body.folder)
})

Methods.add("deleteFile", ({ body }) => {
	return FileDb.deleteFile(body.filename)
})
