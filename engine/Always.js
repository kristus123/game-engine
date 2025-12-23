export class Always {
	static list(value) {
		if (Array.isArray(value)) {
			return value
		} else {
			return [value]
		}
	}
}

