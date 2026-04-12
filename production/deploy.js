import cluster from "cluster"
import { Git } from "#root/production/Git.js"

const services = [
	"#root/server/socket/SocketServer.js",
	"#root/server/http/main.js",
]

function startWorkers() {
	services.forEach(service => {
		const worker = cluster.fork({ SCRIPT_PATH: service })

		worker.on("message", ({ type, data }) => {
			const msg = `[Worker ${worker.id}]`

			if (type == "log") {
				console.log(msg, ...data)
			} else {
				console.error(msg, ...data)
			}
		})
	})
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
		if (await Git.hasNewChanges()) {
			console.log("Git changes detected, restarting workers...")
			await Git.pull()
			restartWorkers()
		}
	}, 2000)
}
else {
	const original = { log: console.log, error: console.error }

	console.log = (...args) => {
		process.send?.({ type: "log", data: args })
		original.log(...args)
	}

	console.error = (...args) => {
		process.send?.({ type: "error", data: args })
		original.error(...args)
	}

	console.log("Starting worker for", process.env.SCRIPT_PATH, "PID:", process.pid)

	import(process.env.SCRIPT_PATH).catch(err => {
		console.error(err)
		process.exit(1)
	})
}
