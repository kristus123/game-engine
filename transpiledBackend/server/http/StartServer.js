import { HttpServer } from '#root/transpiledBackend/server/http/HttpServer.js'; 
import { SfuServer } from '#root/transpiledBackend/server/rtc/SfuServer.js'; 
import { start } from '#root/transpiledBackend/server/start.js'; 

import { pathToFileURL } from "url"

for (const e of Files.getJsFiles("backend/server/http/endpoints")) {
	await import(pathToFileURL(e).href)
}

export function StartServer() {
	const server = HttpServer.listen(3000)

	SfuServer.start().then(() => {
		socketServer.start(server)
	})
}
