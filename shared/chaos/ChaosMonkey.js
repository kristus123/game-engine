export class ChaosMonkey {

	static disabled = true

	static async delay(min = 10, max = 100) {
		if (this.disabled) {
			return false
		}

		const ms = min + Math.random() * (max - min)

		await new Promise(r => setTimeout(r, ms))
	}

	static maybeCrash(message = "CRASH UH OH", chance=0.1) {
		if (this.disabled) {
			return false
		}

		if (this.maybe(chance, "")) {
			throw new Error("CHAOS MONKEY: " + message)
		}
	}

	static maybe(...args) {
		if (this.disabled) {
			return false
		}

		const chance = Args.number(args)

		const a = Args.string(args, "triggered")
		if (a) {
			console.log("ChaosMonkey.maybe - " + a)
		}

		return Math.random() < chance
	}

}
