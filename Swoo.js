import { execSync } from "child_process"
import { AllImports } from "#root/AllImports.js"

const {
	ChildProcess,
	SocketServer,
} = AllImports


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

	static async generateDist(onEnd) {
		await this.p?.kill()

		this.p = new ChildProcess(process.execPath, {
			args: ["dev/GenerateFrontend.js", "DEVELOPMENT"],
			onExit: () => {
				onEnd()
			},
		}).start()
	}

}
