export class A {

	static string(arg) {
		return typeof arg == "string" || arg instanceof String
	}

	static integer(arg) {
		return Number.isInteger(arg)
	}

	static number(arg) {
		if (typeof arg == "number" && !isNaN(arg)) {
			return true
		}
		else {
			return false
		}
	}

	static method(arg) {
		return typeof arg == "function"
	}

	static list(arg) {
		return Array.isArray(arg)
	}

	static object(arg) {
		return typeof arg == "object"
	}

	static jsonString(arg) {
		try {
			if (A.string(arg)) {
				JSON.parse(arg)
				return true
			}
		}
		catch {
			// not json
		}

		return false
	}

	static jsonObject(arg) {
		try {
			if (A.object(arg) || A.list(arg)) {
				JSON.stringify(arg)
				return true
			}
		}
		catch {
			// not json
		}

		return false
	}

}

