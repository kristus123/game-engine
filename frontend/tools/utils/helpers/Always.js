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
		if (A.integer(value)) {
			return value
		}
		else if (A.string(value)) {
			return To.integer(value)
		}
		else {
			throw new Error("value is not something that can be a integer: " + value)
		}

	}

}

