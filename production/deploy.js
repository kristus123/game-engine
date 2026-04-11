import cluster from "cluster"
import { Git } from "#root/production/Git.js"

const services = [
	"#root/server/socket/SocketServer.js",
	"#root/server/http/main.js",
]

const poll_interval = 2000

function startWorkers() {
	services.forEach(service => {
		const worker = cluster.fork({ SCRIPT_PATH: service })
		worker.on("message", ({ type, data }) => {
			const console_method = type === "log" ? console.log : console.error
			console_method(`[Worker ${worker.id}]`, ...data)
		})
	})
}

function restartWorkers() {
	Object.values(cluster.workers).forEach(worker => worker.kill())
	startWorkers()
}

if (cluster.isPrimary) {
	console.log("Primary process started, PID:", process.pid)
	startWorkers()

	setInterval(async () => {
		if (await Git.pull()) {
			console.log("Git changes detected, restarting workers...")
			restartWorkers()
		}
	}, poll_interval)
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
