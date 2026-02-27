import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function checkAndPull(triggerReload) {
	try {
		await execAsync("git fetch")

		const { stdout } = await execAsync("git status -uno")
		const newChanges = !stdout.includes("Your branch is up to date")

		if (newChanges) {
			console.log("[git] New changes detected. Pulling...")

			await execAsync("git pull")
			console.log("[git] Git pull complete.")

			if (triggerReload) {
				triggerReload()
			}
		}
	}
	catch (err) {
		throw new Error(`[git] Operation failed: ${err.message || err}`)
	}
}
