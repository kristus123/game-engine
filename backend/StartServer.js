import { pathToFileURL } from "url"

EnhanceBackend()

async function shutdownBackend(signal) {
	console.log(`Shutting down backend (${signal})`)
	HttpServer.markNotReady()
	const stopSteps = [
		["FFmpeg", async function stopFfmpeg() {
			if (Ffmpeg.p) {
				await Ffmpeg.stop()
			}
			await Ffmpeg.stopClipProcesses()
		}],
		["mediasoup", function stopSfu() {
			return SfuServer.stop()
		}],
		["WebSocket", function stopSocketServer() {
			return SocketServer.stop()
		}],
		["HTTP", function stopHttpServer() {
			return HttpServer.stop()
		}],
	]
	for (const [name, stop] of stopSteps) {
		console.log(`Stopping ${name}`)
		try {
			await stop()
			console.log(`Stopped ${name}`)
		}
		catch (error) {
			console.error("Error during backend shutdown", error)
		}
	}
	process.exit(signal == "SIGINT" ? 130 : 0)
}

export async function StartServer(backendId) {
	let shuttingDown = false
	const shutdown = (signal) => {
		if (shuttingDown) {
			return
		}

		shuttingDown = true
		return shutdownBackend(signal)
	}

	process.once("SIGINT", () => shutdown("SIGINT"))
	process.once("SIGTERM", () => shutdown("SIGTERM"))

	Sha.secret = "CHANGE_ME"

	for (const e of Files.getJsFiles("transpiledBackend/http/endpoints")) { // todo find fix, place path somewhere and find out how to handle transpiled paths
		await import(pathToFileURL(e).href)
	}

	HttpServer.start()

	await SfuServer.start()

	SocketServer.start(HttpServer.activeServer)

	SocketServer.on("HOT_RELOAD_BACKEND_ID", ({ client }) => {
		SocketServer.sendToClient(client, {
			data: { backendId: backendId },
			metaHeaders: { action: "HOT_RELOAD_BACKEND_ID" },
		})
	})

	HttpServer.markReady()
}

import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	StartServer(process.argv[2])
}
