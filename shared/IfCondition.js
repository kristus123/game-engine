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

export class IfCondition {
	static validate(arg) {
		if (An.object(arg)) {
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
		else if (anyTrue(arg == "", arg == null, A.number(arg), A.nan(arg))) {
			throw new Error(`Wonky arg detected in if-condition: ${String(arg)}`)
		}
		else {
			return arg
		}
	}
}
