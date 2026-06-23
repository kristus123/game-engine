import { HttpServer } from "#root/backend/server/http/HttpServer.js"
import { SocketServer } from "#root/backend/server/socket/SocketServer.js"
import { SfuServer } from "#root/backend/server/rtc/SfuServer.js"
import { Files } from "#root/dev/Files.js"
import { pathToFileURL } from "url"

for (const e of Files.getJsFiles("backend/server/http/endpoints")) {
	await import(pathToFileURL(e).href)
}

export function StartServer() {
	const server = HttpServer.listen(3000)

	SfuServer.start().then(() => {
		SocketServer.start(server)
	})
}
