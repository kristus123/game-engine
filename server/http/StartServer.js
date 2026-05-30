import { HttpServer } from "#root/server/http/HttpServer.js"
import { socketServer } from "#root/server/socket/SocketServer.js"
import { SfuServer } from "#root/server/rtc/SfuServer.js"
import { Files } from "#root/dev/build_tools/Files.js"
import { pathToFileURL } from "url"

for (const e of Files.getJsFiles("server/http/endpoints")) {
	await import(pathToFileURL(e).href)
}

export function StartServer() {
	const server = HttpServer.listen(3000)

	SfuServer.start().then(() => {
		socketServer.start(server)
	})
}