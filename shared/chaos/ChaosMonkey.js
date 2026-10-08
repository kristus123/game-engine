export class ChaosMonkey {

	static disabled = true

	static async delay(min = 100, max = 1_000) {
		if (disabled) {
			return
		}

		const ms = min + Math.random() * (max - min)

		await new Promise(r => setTimeout(r, ms))
	}

	static maybeCrash(chance = 0.1, message = "CRASH UH OH") {
		if (disabled) {
			return
		}

		if (Math.random() < chance) {
			throw new Error("CHAOS MONKEY: " + message)
		}
	}

}
