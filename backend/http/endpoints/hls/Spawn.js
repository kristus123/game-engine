import { spawn } from "child_process"

export class Spawn {

	constructor(command, args = []) {
		console.log("Starting:", command, args.join(" "))

		this.p = spawn(command, args)

		console.log("PID:", this.p.pid)

		this.p.stdout.on("data", data => {
			console.log(`[${command} stdout]`, data.toString().trim())
		})

		this.p.stderr.on("data", data => {
			console.log(`[${command} stderr]`, data.toString().trim())
		})

		this.p.stdin.on("error", error => {
			console.error(`[${command} stdin error]`, error)
		})

		this.p.stdin.on("close", () => {
			console.log(`[${command}] stdin closed`)
		})

		this.p.on("error", error => {
			console.error(`[${command} process error]`, error)
		})

		this.p.on("close", (code, signal) => {
			console.log(`[${command}] exited:`, { code, signal })
		})
	}

	get stdin() {
		return this.p.stdin
	}

	get stdout() {
		return this.p.stdout
	}

	get stderr() {
		return this.p.stderr
	}

	get pid() {
		return this.p.pid
	}

	waitForSpawn() {
		return new Promise((resolve, reject) => {
			this.p.once("spawn", () => {
				console.log("Spawned")
				resolve()
			})

			this.p.once("error", reject)
		})
	}

	waitForClose() {
		if this.p.exitCode != null || this.p.signalCode != null {
			return Promise.resolve({ code: this.p.exitCode, signal: this.p.signalCode })
		}

		return new Promise(resolve => {
			this.p.once("close", (code, signal) => {
				resolve({ code, signal })
			})
		})
	}

	write(buffer) {
		if !Buffer.isBuffer(buffer) {
			throw new Error("Spawn write expected a Buffer")
		}

		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				this.p.kill("SIGKILL")
				reject(new Error("Encoder stopped accepting media"))
			}, 8_000)
			timeout.unref()
			this.stdin.write(buffer, error => {
				clearTimeout(timeout)
				if error {
					reject(error)
				}
				else {
					resolve()
				}
			})
		})
	}

	stop() {
		const closed = this.waitForClose()
		const forceKill = setTimeout(() => this.p.kill("SIGKILL"), 2_000)
		forceKill.unref()
		this.stdin.end()
		return closed.finally(() => clearTimeout(forceKill))
	}
}
