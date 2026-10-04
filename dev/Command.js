import { exec, execSync } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export class Command {
	static sync(command) {
		const r = execSync(command, { encoding: "utf8" })
		console.log(r)
		return r
	}

	static async async(command) {
		const { stdout, stderr } = await execAsync(command)

		return { stdout, stderr }
	}
}
