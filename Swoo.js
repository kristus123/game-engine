import { ChildProcess, SocketServer, Command } from "#root/AllImports.js"


export class Swoo {

	// todo improve later
	static killPorts() {

		try {// todo make a windows version as well
			Command.sync("./scripts/kill_ports.sh")
		}
		catch (e) {
			console.log(e)
			console.log("failed to kill ports. most likely because this is a windows pc")
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
