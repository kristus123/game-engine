import { pathToFileURL } from "url"

export function StartServer(backendId) {
	for (const e of Files.getJsFiles("transpiledBackend/http/endpoints")) { // todo find fix, place path somewhere and find out how to handle transpiled paths
		console.log("___")
		console.log(e)
		console.log("___")
		await import(pathToFileURL(e).href)
	}

	const server = HttpServer.start()

	await SfuServer.start()

	SocketServer.start(server, {
		onJoin: clientId => {
			SocketServer.sendToClient(clientId, {
				action: "HOT_RELOAD_BACKEND_ID",
				backendId: backendId,
			})
		},
	})

	SocketServer.on("HOT_RELOAD_BACKEND_ID", (client) => {
		SocketServer.sendToClient(client, {backendVersion: backendVersion})
	})
}


import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	const backendId = process.argv[2] 
	StartServer(backendId)
}
