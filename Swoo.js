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

	static async generateDist(onEnd) {
		await this.p?.kill()

		this.p = new ChildProcess(process.execPath, {
			args: ["dev/GenerateFrontend.js", "DEVELOPMENT"],
			onExit: () => {
				onEnd()
			},
		}).start()

		await this.p?.awaitFinish?.()
	}

}
