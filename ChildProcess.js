import { spawn } from "child_process"

export class ChildProcess {

	constructor(command, { args = [], onExit=() => {} } = {}) {
		this.command = command
		this.args = args
		this.onExit = onExit
		this.process = null
	}

	start() {
		this.process = spawn(this.command, this.args, {
			stdio: "inherit"
		})

		this.process.on("spawn", () => {
			console.log("Child process spawned")
		})

		this.process.on("error", error => {
			console.log("Child process error:", error)
		})

		this.process.on("exit", (code, signal) => {
			console.log(`Child process exited: code=${code}, signal=${signal}`)
			this.onExit()
			this.process = null
		})

		this.process.on("close", (code, signal) => {
			console.log(`Child process closed: code=${code}, signal=${signal}`)
		})

		this.process.on("disconnect", () => {
			console.log("Child process disconnected")
		})

		return this
	}

	kill() {
		this.process?.kill("SIGTERM")
		this.process = null

		return this
	}

	async restart() {
		const a = this.awaitFinish()
		this.kill()
		await a

		this.start()

		return this
	}

	async awaitFinish() {
		return new Promise((resolve, reject) => {
			if (this.process) {
				this.process.once("exit", (code, signal) => {
					resolve({ code, signal })
				})
			}
			else {
				reject("can't await if nothing is running")
			}
		})
	}
}
