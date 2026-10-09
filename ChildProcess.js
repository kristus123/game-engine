import { spawn } from "child_process"

export class ChildProcess {
	static activeChildren = new Set()

	constructor(command, { args = [], onExit=() => {}, group = null } = {}) {
		this.command = command
		this.args = args
		this.onExit = onExit
		this.group = group
		this.process = null
	}

	start() {
		this.process = spawn(this.command, this.args, {
			stdio: "inherit"
		})
		ChildProcess.activeChildren.add(this)

		this.process.on("spawn", () => {
			console.log("Child process spawned")
		})

		this.process.on("error", error => {
			console.log("Child process error:", error)
		})

		this.process.on("exit", (code, signal) => {
			console.log(`Child process exited: code=${code}, signal=${signal}`)
			this.onExit({ code, signal })
			this.process = null
		})

		this.process.on("close", (code, signal) => {
			console.log(`Child process closed: code=${code}, signal=${signal}`)
			ChildProcess.activeChildren.delete(this)
		})

		this.process.on("disconnect", () => {
			console.log("Child process disconnected")
		})

		return this
	}

	static async stopAll(group) {
		const children = [...this.activeChildren].filter(child => child.group == group)
		await Promise.all(children.map(child => child.kill()))
	}

	async kill() {
		const child = this.process
		if (!child || child.exitCode != null || child.signalCode != null) {
			return
		}

		const finished = new Promise(resolve => child.once("close", resolve))
		child.kill("SIGTERM")

		const forceKillTimeout = setTimeout(() => {
			if (child.exitCode == null && child.signalCode == null) {
				child.kill("SIGKILL")
			}
		}, 8_000)
		forceKillTimeout.unref()

		await finished
		clearTimeout(forceKillTimeout)
		if (this.process == child) {
			this.process = null
		}
	}

	awaitFinish() {
		const child = this.process
		if (!child) {
			return Promise.resolve()
		}
		if (child.exitCode != null || child.signalCode != null) {
			return Promise.resolve({ code: child.exitCode, signal: child.signalCode })
		}

		return new Promise(resolve => {
			child.once("close", (code, signal) => resolve({ code, signal }))
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
