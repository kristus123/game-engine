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
