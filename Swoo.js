import { execSync } from "child_process"
import { AllImports } from "#root/AllImports.js"

const {
	ChildProcess,
	SocketServer,
} = AllImports


let idTimeout = null

export class Swoo {

	// todo improve later
	static killPorts() {
		try {
			execSync("./scripts/kill_ports.sh", { stdio: "inherit" }) // todo make a windows version as well
		}
		catch (e) {
			console.log(e)
			console.log("failed to kill ports. most likely because this is a windows pc")
		}
	}

	static generateDist(onEnd) {
		this.p?.kill()

		this.p = new ChildProcess(process.execPath, {
			args: ["dev/GenerateFrontend.js", "DEVELOPMENT"],
			onExit: () => {
				onEnd()
			},
		}).start()
	}

	static triggerClientReload() {
		if (idTimeout) {
			clearTimeout(idTimeout)
		}

		idTimeout = setTimeout(() => {
			SocketServer.sendToEveryone({ action: "HOT_RELOAD" })
			idTimeout = null
		}, 100)
	}

}
