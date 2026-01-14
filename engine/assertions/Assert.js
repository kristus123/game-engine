export class Assert {
	static method(m) {
		if (not.method(m)) {
			throw new Error('not a method!')
		}
	}

	static value(v) {
		AssertNotNull(v)
	}
	static length(amount, list) {
		if (list.length !== amount) {
			throw new Error("xXx");
  		}
	}
}
