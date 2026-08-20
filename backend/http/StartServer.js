import { pathToFileURL } from "url"

for (const e of Files.getJsFiles("transpiledBackend/http/endpoints")) { // todo find fix
	console.log("___")
	console.log(e)
	console.log("___")
	await import(pathToFileURL(e).href)
}

export function StartServer() {
	const server = HttpServer.start()

	SfuServer.start().then(() => {
		SocketServer.start(server)
	})
}
