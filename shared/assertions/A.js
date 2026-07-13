export class A {

	static string(arg) { // no-null-check // todo make do transpiler-disable-null-assert to be super clear
		return typeof arg == "string" || arg instanceof String
	}

	static integer(arg) { // no-null-check
		return Number.isInteger(arg)
	}

	static number(arg) { // no-null-check
		if (typeof arg == "bigint") {
			throw new Error(`BigInt is currently not supported discuss how to handle bigints: ${arg}`)
		}

		if (typeof arg == "number" && !isNaN(arg)) {
			return true
		}
		else {
			return false
		}
	}

	static method(arg) { // no-null-check
		return typeof arg == "function"
	}

	static list(arg) { // no-null-check
		return Array.isArray(arg)
	}

	static bool(arg) {
		return typeof arg == "boolean"
	}

	static array(arg) { // no-null-check
		return Array.isArray(arg)
	}

	static nan(arg) {
		return Number.isNaN(arg)
	}

	static object(arg) {
		return (
			arg != null &&
			typeof arg == "object" &&
			arg.constructor == Object
		)
	}

	static emptyObject(arg) {
		return (
			arg != null &&
			typeof arg == "object" &&
			arg.constructor == Object &&
			Object.keys(arg).length == 0
		)
	}

	static jsonString(arg) { // no-null-check
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

	static jsonObject(arg) { // no-null-check
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

