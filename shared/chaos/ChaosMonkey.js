export class ChaosMonkey {

	static disabled = false
	static chance = 0.1

	static async delay(min = 0, max = 3_000) {
		if (this.disabled) {
			return
		}

		const ms = min + Math.random() * (max - min)

		await new Promise(r => setTimeout(r, ms))
	}

	static maybeCrash(message = "CRASH UH OH") {
		if (this.disabled) {
			return
		}

		if (Math.random() < this.chance) {
			throw new Error("CHAOS MONKEY: " + message)
		}
	}

}
