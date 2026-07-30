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
			if (An.emptyList(arg)) {
				return false
			}
			else {
				return true
			}
		}
		else if (A.number(arg)) {
			// maybe do positive numbers as true and negative numbers as false. todo think
			throw new Error("numbers are not allowed in if condition. i am not sure what is best")
		}
		else if (A.nan(arg)) {
			throw new Error("NAN not allowed in if condition")
		}
		else if (arg == "") {
			return false
			// Think about how we should handle this later
			// throw new Error("emtpry string is not allowed in if condition")
		}
		else if (arg == null) {
			// console.log("null values in if's are treated like false")
			return false
		}
		else {
			return true
			// should we instead threat a value as true? todo think
			// Decide whether to treat it as true or to throw an error
			//
			// console.log("___")
			// console.log("type:")
			// console.log(typeof arg)
			// console.log("___")
			// throw new Error("Please handle: " + arg)
		}
	}
}


Assert.true(IfCondition.validate(true))
Assert.false(IfCondition.validate(false))

Assert.true(IfCondition.validate(["list with values"]))
Assert.false(IfCondition.validate([])) // list with no values

Assert.true(IfCondition.validate({ values: "yes" }))
Assert.false(IfCondition.validate({})) // empty object

// Assert.true(IfCondition.validate(1)) // should it ?
// Assert.false(IfCondition.validate(0)) // should it ?


// Assert.true(IfCondition.validate("hello")) // maybe return true?
Assert.false(IfCondition.validate(null))

// Assert.throwsError()
function throwsError(callback) { // move into Assert
	try {
		callback()
		return false
	}
	catch (e) {
		return true
	}
}

Assert.true(IfCondition.validate("hello"))

// Assert.true(throwsError(() => {
// 	IfCondition.validate("")
// }))
