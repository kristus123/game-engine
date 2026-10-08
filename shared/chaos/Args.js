export class Args {
	static number(args) {
		const index = args.findIndex(arg => typeof arg == "number")

		if (index == -1) {
			throw new Error("Missing number argument")
		}

		return args.splice(index, 1)[0]
	}

	static string(args, defaultValue) {
		const index = args.findIndex(arg => typeof arg == "string")

		if (index == -1) {
			if (defaultValue) {
				return defaultValue
			}
			else {
				throw new Error("Missing string argument")
			}
		}
		else {
			return args.splice(index, 1)[0]
		}
	}
}
