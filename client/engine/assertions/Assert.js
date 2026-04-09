export class Assert {
	static method(m) {
		if (not.method(m)) {
			throw new Error("not a method!")
		}

		return m
	}

	static notList(e) {
		if (Array.isArray(e)) {
			throw new Error("element is a list")
		}
		else {
		}
	}

	static either(value, allowedValues) {
		Assert.array(allowedValues)

		if (!allowedValues.includes(value)) {
			throw new Error(`v: ${value} is invalid. Expected: ${allowedValues.join(", ")}`)
		}
		else {
			return value
		}
	}

	static notZero(n) {
		if (n == 0) {
			throw new Error("number should not be zero")
		}
		else {
			return n
		}
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

	static notPresent(v) {
		if (v === null) {
			return v
		}
		else if (v === undefined) {
			return v
		}
		else {
			throw new Error("")
		}
	}

	static notNull(x, errorMessage="add own message!") {
		if (x === null) {
			throw new Error(errorMessage + " NULL IS CONSIDERED BAD. BITCH")
		}
		else if (x === undefined) {
			throw new Error(errorMessage + " UNDEFINED IS CONSIDERED BAD. BITCH")
		}
		else if (typeof x === "number" && isNaN(x)) {
			throw new Error(errorMessage + " NOT A NUMBER (nan) IS CONSIDERED BAD. BITCH")
		}
		else {
			return x
		}

		// if (typeof x === 'string' && x.trim() === '') {
		// 	throw new Error(errorMessage + " EMPTY STRINGS ARE CONSIDERED BAD. BITCH")
		// }
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
			throw new Error(x + " is not a string")
		}
	}
}
