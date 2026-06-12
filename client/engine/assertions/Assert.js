export class Assert {

	static true(o) {
		if (o == true) {
			return o
		}
		else {
			throw new Error("value should be true, but is: " + o)
		}
	}

	static false(o) {
		if (o == false) {
			return o
		}
		else {
			throw new Error("value should be false, but is: " + o)
		}
	}

	static bool(o) {
		if ( o == true || o == false) { // Maybe there is a better way to do this.
			return o
		}
		else {
			throw new Error("value should be a bool, but is: " + o)
		}
	}

	static jsonObject(o) {
		if (A.jsonObject(o)) {
			return o
		}
		else {
			throw new Error(`not valid json: ${o}`)
		}
	}

	static jsonString(o) {
		if (A.jsonString(o)) {
			return o
		}
		else {
			throw new Error(`string is not valid json: ${o}`)
		}
	}

	static method(m) {
		if (Not.method(m)) {
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

	static notEmpty(n) {
		Assert.array(n)

		if (n.length == 0) {
			throw new Error("list should not be empty")
		}
		else {
			return n
		}
	}

	static array(x, callback=e => {}) {
		if (Not.array(x)) {
			throw new Error("NOT AN ARRAY")
		}
		else {
			for (const e of x) {
				callback(e)
			}

			return x
		}
	}

	static value(v, message) {
		Assert.notNull(v, message)
		return v
	}


	static integer(v) {
		if (Not.integer(v)) {
			throw new Error("Not an integer: " + v)
		}

		return v
	}

	static length(amount, list) {
		if (list.length != amount) {
			throw new Error("xXx")
  		}

		return list
	}

	static notPresent(v) {
		if (v == null) {
			return v
		}
		else if (v == undefined) {
			return v
		}
		else {
			throw new Error("")
		}
	}

	static notNull(x, errorMessage="add own message!") {
		if (x == null) {
			throw new Error(errorMessage + " NULL IS CONSIDERED BAD. SMILE!!!")
		}
		else if (x == undefined) {
			throw new Error(errorMessage + " UNDEFINED IS CONSIDERED BAD. SMILE!!!")
		}
		else if (typeof x == "number" && isNaN(x)) {
			throw new Error(errorMessage + " NOT A NUMBER (nan) IS CONSIDERED BAD. SMILE!!!")
		}
		else {
			return x
		}

		// if (typeof x == 'string' && x.trim() == '') {
		// 	throw new Error(errorMessage + " EMPTY STRINGS ARE CONSIDERED BAD. SMILE!!!")
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

	static ofType(o, t) {
		return o instanceof t
	}

	static type(x, classType) {
		if (x instanceof classType) {
		}
		else {
			throw new Error(`${x} is not of expected class`)
		}
	}
}
