export class Not {

	static method(arg) {
		return !A.method(arg)
	}

	static integer(arg) {
		return !A.integer(arg)
	}

	static array(x) {
		return !Array.isArray(x)
	}
}
