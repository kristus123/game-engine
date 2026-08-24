import { pathToFileURL } from "url"

for (const e of Files.getJsFiles("transpiledBackend/http/endpoints")) { // todo find fix, place path somewhere and find out how to handle transpiled paths
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
