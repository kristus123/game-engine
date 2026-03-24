export class Assert {
	static method(m) {
		if (not.method(m)) {
			throw new Error("not a method!")
		}

		return m
	}

	static array(x) {
		if (not.array(x)) {
			throw new Error("NOT AN ARRAY")
		}

		return x
	}

	static value(v) {
		Assert.notNull(v)
		return v
	}

	static integer(v) {
		if (not.integer(v)) {
			throw new Error("Not an integer: " + v)
		}

		return v
	}

	static length(amount, list) {
		if (list.length !== amount) {
			throw new Error("xXx")
  		}

		return list
	}

	static notNull(x, errorMessage="add own message!") {
		if (x === null) {
			throw new Error(errorMessage + " NULL IS CONSIDERED BAD. BITCH")
		}

		if (x === undefined) {
			throw new Error(errorMessage + " UNDEFINED IS CONSIDERED BAD. BITCH")
		}

		// if (typeof x === 'string' && x.trim() === '') {
		// 	throw new Error(errorMessage + " EMPTY STRINGS ARE CONSIDERED BAD. BITCH")
		// }

		if (typeof x === "number" && isNaN(x)) {
			throw new Error(errorMessage + " NOT A NUMBER (nan) IS CONSIDERED BAD. BITCH")
		}

		return x
	}

	static noNullInArray(array) {
		Assert.notNull(array)

		for (const o of array) {
			Assert.notNull(o)
		}

		return array
	}

	static string(x) {
		if (typeof x == "string") {
			return x
		}
		else {
			throw new Error(x + " is not a string");
		}
	}
}
