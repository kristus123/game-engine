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

	async kill() {
		await this.awaitFinish()
		this.process?.kill("SIGTERM")
	}

	awaitFinish() {
		return new Promise(resolve => {
			if (this.process) {
				this.process.once("exit", (code, signal) => {
					resolve({ code, signal })
				})
			}
			else {
				resolve()
			}
		})
	}


	async restart() {
		if (this.process) {
			await this.kill()

		}

		this.start()

		return this
	}

}
