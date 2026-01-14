export class Args {
	static list(...args) {
		return args.filter(a.list).assertLength(1)[0]
	}


	static string(...args) {
		return args.filter(a.string).assertLength(1)[0]
	}

	static number(...args) {
		return args.filter(a.number).assertLength(1)[0]
	}

	static max(n, ...args) {
		args.assertLength(n)
	}
}

