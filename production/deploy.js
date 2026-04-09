import cluster from "cluster"
import { Git } from "#root/production/Git.js"

const services = [
	"#root/server/socket/SocketServer.js",
	"#root/server/http/main.js",
]

function startWorkers() {
	for (const s of services) {
		const worker = cluster.fork({ SCRIPT_PATH: s })

		worker.on("message", msg => {
			if (msg.type === "log") {
				console.log(`[Worker ${worker.id}]`, ...msg.data)
			}
			else if (msg.type === "error") {
				console.error(`[Worker ${worker.id}]`, ...msg.data)
			}
		})
	}
}

function restartWorkers() {
	for (const id in cluster.workers) {
		cluster.workers[id].kill()
	}
	startWorkers()
}

if (cluster.isPrimary) {
	console.log("Primary process started, PID:", process.pid)
	startWorkers()

	setInterval(async () => {
		const changes = await Git.pull()
		if (changes) {
  	console.log("Git changes detected, restarting workers...")
  	restartWorkers()
		}
	}, 2 * 1000)
}
else {
	// Worker process
	const log = console.log
	const error = console.error

	// Override console to forward logs to primary
	console.log = (...args) => {
		process.send?.({ type: "log", data: args })
		log(...args)
	}

	console.error = (...args) => {
		process.send?.({ type: "error", data: args })
		error(...args)
	}

	console.log("Starting worker for", process.env.SCRIPT_PATH, "PID:", process.pid)

	import(process.env.SCRIPT_PATH).catch((err) => {
		console.error(err)
		process.exit(1)
	})
}
