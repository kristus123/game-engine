export class Registry {
	static {
	}

	static add(o) {
		const list = this[o.constructor.name]
		if (list == null) {
			this[o.constructor.name] = [o]
		}
	}

	static remove(o) {
		const list = this[o.constructor.name]
		List.remove(list, o)
	}

}
