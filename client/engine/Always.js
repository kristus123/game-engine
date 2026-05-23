export class Always {
	
	static list(value) {
		if (Array.isArray(value)) {
			return value
		}
		else {
			return [value]
		}
	}

	static integer(value) {
		// 1. Strict string format check
		if (typeof value == "string" && !/^-?\d+(\.0+)?$/.test(value)) {
			throw new Error("invalid integer format: " + value)
		}

		// 2. Convert
		const n = Number(value)

		// 3. Explicit NaN / invalid number check
		if (Number.isNaN(n)) {
			throw new Error("NaN is not a valid integer")
		}

		// 4. Finite check (catches Infinity / -Infinity)
		if (!Number.isFinite(n)) {
			throw new Error("only finite numbers allowed: " + value)
		}

		// 5. Must be integer (rejects decimals like 10.5)
		if (!Number.isInteger(n)) {
			throw new Error("only integers (or .0 floats) allowed: " + value)
		}

		return n
	}
}

