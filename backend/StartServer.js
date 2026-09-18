import { pathToFileURL } from "url"

export async function StartServer(backendId) {

	for (const e of Files.getJsFiles("transpiledBackend/http/endpoints")) { // todo find fix, place path somewhere and find out how to handle transpiled paths
		await import(pathToFileURL(e).href)
	}

	HttpServer.start()

	await SfuServer.start()

	SocketServer.start(HttpServer.activeServer, {
		onJoin: client => {
			SocketServer.sendToClient(client, {
				action: "HOT_RELOAD_BACKEND_ID",
				backendId: backendId,
			})
		},
	})

	SocketServer.on("HOT_RELOAD_BACKEND_ID", (client) => {
		SocketServer.sendToClient(client, {
			action: "HOT_RELOAD_BACKEND_ID",
			backendId: backendId,
		})
	})
}

import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	StartServer(process.argv[2])

	process.on("SIGTERM", () => {
		console.log("SIGTERM received. shutting down all stuff")
		HttpServer.stop()
		process.exit(0)
	})
}
