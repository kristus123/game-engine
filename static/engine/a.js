export class a {
	constructor() {
	}

	static string(arg) {
		return typeof arg === 'string' || arg instanceof String
	}

	static number(arg) {
		if (typeof arg === 'number' && !isNaN(arg)) {
			return true
		}
		else {
			return false
	  console.log('variable is NOT a number')
		}


	}

}
