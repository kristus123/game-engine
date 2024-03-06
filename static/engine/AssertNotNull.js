export function AssertNotNull(x, errorMessage) {
	if (x === null) {
		throw new Error(errorMessage + " NULL IS CONSIDERED BAD. BITCH")
	}  

	if (x === undefined) {
		throw new Error(errorMessage + " UNDEFINED IS CONSIDERED BAD. BITCH")
	}
  
	// if (typeof x === 'string' && x.trim() === '') {
	// 	throw new Error(errorMessage + " EMPTY STRINGS ARE CONSIDERED BAD. BITCH")
	// }

	if (typeof x === 'number' && isNaN(x)) {
		throw new Error(errorMessage + " NOT A NUMBER (nan) IS CONSIDERED BAD. BITCH")
	}
}
