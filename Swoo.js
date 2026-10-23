import { ChildProcess, SocketServer, Command } from "#root/AllImports.js"
import { execFileSync } from "node:child_process"


export class Swoo {

	// todo improve later
	static killPorts() {
		if (process.platform == "win32") {
			return this.killWindowsPorts()
		}

		try {
			Command.sync("./scripts/kill_ports.sh")
		}
		catch (e) {
			console.log(e)
			console.log("failed to kill ports")
		}
	}

	static killWindowsPorts() {
		try {
			const output = execFileSync("netstat", ["-ano", "-p", "tcp"], { encoding: "utf8" })
			const ports = new Set(["3000", "5050"])
			const pids = new Map()

			for (const line of output.split(/\r?\n/)) {
				const fields = line.trim().split(/\s+/)
				if (fields[0] != "TCP" || fields[3] != "LISTENING") {
					continue
				}

				const port = fields[1].split(":").at(-1)
				if (ports.has(port)) {
					pids.set(fields[4], port)
				}
			}

			for (const [pid, port] of pids) {
				console.log(`Killing process on port ${port} (PID: ${pid})`)
				execFileSync("taskkill", ["/PID", pid, "/F"], { stdio: "inherit" })
			}

			for (const port of ports) {
				if (![...pids.values()].includes(port)) {
					console.log(`No process found on port ${port}`)
				}
			}
		}
		catch (error) {
			console.log(error)
			console.log("failed to kill ports on Windows")
		}
	}

	static async generateDist() {
		await this.p?.kill()

		const frontendProcess = new ChildProcess(process.execPath, {
			args: ["dev/GenerateFrontend.js", "DEVELOPMENT"],
		}).start()
		this.p = frontendProcess

		const result = await frontendProcess.awaitFinish()
		if (this.p == frontendProcess) {
			this.p = null
		}
		if (result.code != 0 || result.signal != null) {
			throw new Error(`Frontend generation failed: code=${result.code}, signal=${result.signal}`)
		}
		return result
	}

	static async stop() {
		await this.p?.kill()
		this.p = null
	}

}
