import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export class Git {

	static async pull() {
		try {
			await execAsync("git fetch")
			const { stdout } = await execAsync("git status -uno")

			if (stdout.includes("Your branch is up to date")) {
				return false
			}

			console.log("[git] New changes detected. Pulling...")
			await execAsync("git pull")
			console.log("[git] Git pull complete.")
			return true
		}
		catch (err) {
			throw new Error(`[git] Operation failed: ${err.message || err}`)
		}
	}

}
