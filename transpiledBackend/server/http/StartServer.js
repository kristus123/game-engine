import { HttpServer } from '#root/transpiledBackend/server/http/HttpServer.js'; 
import { SfuServer } from '#root/transpiledBackend/server/rtc/SfuServer.js'; 
import { SocketServer } from '#root/transpiledBackend/server/socket/SocketServer.js'; 
import { Files } from '#root/dev/Files.js'; 

import { pathToFileURL } from "url"

for (const e of Files.getJsFiles("transpiledBackend/server/http/endpoints")) { // todo find fix
	await import(pathToFileURL(e).href)
}

export function StartServer() {
	const server = HttpServer.listen(3000)

	SfuServer.start().then(() => {
		SocketServer.start(server)
	})
}
