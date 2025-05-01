export class Registry {
	static {
		this.Chicken = []
		this.ChickenBox = []
	}

	static add(o) {
		const list = this[o.constructor.name]
		if (list == null) {
			this[o.constructor.name] = [o]
		}
		else {
			this[o.constructor.name].push(o)
		}
	}

	static remove(o) {
		const list = this[o.constructor.name]
		List.remove(list, o)
	}

}
