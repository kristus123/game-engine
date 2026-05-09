import { HttpServer } from "#root/server/http/HttpServer.js"
import { socketServer } from "#root/server/socket/SocketServer.js"
import { pathToFileURL } from "url"

import Files from "#root/dev/build_tools/Files.js"

for (const e of Files.getJsFiles("server/http/endpoints")) {
	await import(pathToFileURL(e).href)
}

const server = HttpServer.listen(3000)

socketServer.start(server)
