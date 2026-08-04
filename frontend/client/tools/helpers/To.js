export class To {

	static integer(value) {
		if (typeof value == "string" && !/^-?\d+(\.0+)?$/.test(value)) {
			throw new Error("invalid integer format: " + value)
		}

		const n = Number(value)

		if (Number.isNaN(n)) {
			throw new Error("NaN is not a valid integer")
		}
		else if (!Number.isFinite(n)) {
			throw new Error("only finite numbers allowed: " + value)
		}
		else if (!Number.isInteger(n)) {
			throw new Error("only integers (or .0 floats) allowed: " + value)
		}
		else {
			return n
		}
	}

}
