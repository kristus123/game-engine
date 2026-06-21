import { Git } from '#root/transpiledBackend/production/Git.js'; 
import { deploy } from '#root/transpiledBackend/production/deploy.js'; 
import { StartServer } from '#root/transpiledBackend/server/http/StartServer.js'; 
import { SocketServer } from '#root/transpiledBackend/server/socket/SocketServer.js'; 

import cluster from "cluster"

const services = [
	"#root/backend/server/socket/SocketServer.js",
	"#root/backend/server/http/StartServer.js",
]

function startWorkers() {
	for (const s of services) {
		const worker = cluster.fork({ SCRIPT_PATH: s })

		worker.on("message", msg => {
			if (msg.type == "log") {
				console.log(`[Worker ${worker.id}]`, ...msg.data)
			}
			else if (msg.type == "error") {
				console.error(`[Worker ${worker.id}]`, ...msg.data)
			}
		})
	}
}

if (cluster.isPrimary) {
	console.log("Primary process started, PID:", process.pid)
	startWorkers()

	setInterval(async () => {
		const changes = await Git.pull()
		if (changes) {
			console.log("Git changes detected, restarting workers...")

			for (const id in cluster.workers) {
				cluster.workers[id].kill()
			}
			startWorkers()
		}
	}, 2 * 1000)
}
else {
	const log = console.log
	const error = console.error

	// Override console to forward logs to primary
	console.log = (...args) => {
			Assert.notNull(args, 'param 1 - args - deploy.null')
		process.send?.({ type: "log", data: args })
		log(...args)
	}

	console.error = (...args) => {
			Assert.notNull(args, 'param 1 - args - deploy.null')
		process.send?.({ type: "error", data: args })
		error(...args)
	}

	console.log("Starting worker for", process.env.SCRIPT_PATH, "PID:", process.pid)

	import(process.env.SCRIPT_PATH).catch((err) => {
		console.error(err)
		process.exit(1)
	})
}
