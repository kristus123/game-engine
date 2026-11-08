export class A {

	static string(arg) { // allow-null // todo make do transpiler-disable-null-assert to be super clear
		return typeof arg == "string" || arg instanceof String
	}

	static integer(arg) { // allow-null
		return Number.isInteger(arg)
	}

	static number(arg) { // allow-null
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

	static method(arg) { // allow-null
		return typeof arg == "function"
	}

	static list(arg) { // allow-null
		return Array.isArray(arg)
	}

	static bool(arg) {
		return typeof arg == "boolean"
	}

	static array(arg) { // allow-null
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

	static emptyList(arg) {
		return A.list(arg) && arg.length == 0 // todo replace with arg.legnth or smt more clean, isEmpty, not sure yet
	}

	static jsonString(arg) { // allow-null
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

	static jsonObject(arg) { // allow-null
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

	static notNull(x) {
		return !this.null(x)
	}

	static value(x) {
		return !this.null(x)
	}

	static promise(x) {
		return x != null && typeof x.then == "function"
	}

	static null(x) {
		if (x == null) {
			return true
		}
		else if (x == undefined) {
			return true
		}
		else if (typeof x == "number" && isNaN(x)) {
			return true
		}
		else {
			return false
		}

		// if (typeof x == 'string' && x.trim() == '') {
		// 	throw new Error(errorMessage + " EMPTY STRINGS ARE CONSIDERED BAD. SMILE!!!")
		// }

	}


}

