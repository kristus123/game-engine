import { exec } from "child_process"
import { promisify } from "util"

export class Git {

	static async pull() {
		const execAsync = promisify(exec)

		try {
			await execAsync("git fetch")

			const { stdout } = await execAsync("git status -uno")

			if (stdout.includes("Your branch is up to date")) {
				return Promise.resolve(false)
			}
			else {
				console.log("[git] New changes detected. Pulling...")
				await execAsync("git pull")
				console.log("[git] Git pull complete.")
				return Promise.resolve(true)
			}
		}
		catch (err) {
			throw new Error(`[git] Operation failed: ${err.message || err}`)
		}
	}

}
