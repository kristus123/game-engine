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
		return new Promise(resolve => {
			this.p.once("close", (code, signal) => {
				resolve({ code, signal })
			})
		})
	}

	write(buffer) {
		if (!Buffer.isBuffer(buffer)) {
			throw new Error("Spawn write expected a Buffer")
		}

		console.log("Writing chunk:", buffer.length)

		const ok = this.stdin.write(buffer)

		console.log("stdin.write:", ok)

		if (ok) {
			return Promise.resolve()
		}

		console.log("Waiting for drain")

		return new Promise((resolve, reject) => {
			const onDrain = () => {
				cleanup()
				console.log("Drain")
				resolve()
			}

			const onError = error => {
				cleanup()
				reject(error)
			}

			const cleanup = () => {
				this.stdin.off("drain", onDrain)
				this.stdin.off("error", onError)
			}

			this.stdin.once("drain", onDrain)
			this.stdin.once("error", onError)
		})
	}

	stop() {
		this.stdin.end()
		return this.waitForClose()
	}
}
