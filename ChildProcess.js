import { spawn } from "child_process"

export class ChildProcess {

	constructor(command, args = []) {
		this.command = command
		this.args = args
		this.process = null
	}

	start() {
		this.process = spawn(this.command, this.args, {
			stdio: "inherit"
		})

		return this
	}

	stop() {
		this.process?.kill("SIGTERM")
		this.process = null
	}

	restart() {
		this.stop()
		this.start()
		return this
	}

}
