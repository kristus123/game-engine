export class Assert {
	static method(m) {
		if (not.method(m)) {
			throw new Error('not a method!')
		}
	}

	static value(v) {
		AssertNotNull(v)
		return v
	}

	static integer(v) {
		if (not.integer(v)) {
			throw new Error('Not an integer: ' + v)
		}
	}

	static length(amount, list) {
		if (list.length !== amount) {
			throw new Error('xXx')
  		}
	}
}
