// todo rename file
// this can be used with transpiler
// nabir - what do you think?

function anyTrue(...args) {
	for (const a of args) {
		Assert.bool(a)

		if (a == true) {
			return true
		}
	}

	return false
}

export class IfCondition { // maybe rename to function _If(arg)

	static validate(arg) {
		if (A.bool(arg)) {
			return arg
		}
		else if (An.object(arg)) {
			if (An.emptyObject(arg)) {
				return false
			}
			else {
				return true
			}
		}
		else if (A.list(arg)) {
			if (arg.notEmpty) {
				return true
			}
			else {
				return false
			}
		}
		else if (arg == null) {
			throw new Error("null value not allowed in if condition")
		}
		else if (A.number(arg)) {
			throw new Error("numbers are not allowed in if condition")
		}
		else if (A.nan(arg)) {
			throw new Error("NAN not allowed in if condition")
		}
		else if (arg == "") {
			throw new Error("emtpry string is not allowed in if condition")
		}
		else {
			console.log("___")
			console.log("type:")
			console.log(typeof arg)
			console.log("___")
			throw new Error("Please handle: " + arg)
		}
	}

}
