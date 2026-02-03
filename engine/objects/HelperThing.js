export class HelperThing {
	constructor(classes=[]) {

		for (const c of classes) {
			if (c == null) {
				throw new Error('null passed into Runall')
			}
		}
	}

	static update(objects) {
		this.updateAnd(objects, () => {})
	}

	static updateAnd(objects, run=() => {}) {
		for (const o of objects) {
			try {
				if (o.update) {
					run(o)
					o.update()
				}
			}
			catch (error) {
				throw error
			}
		}
	}

	add(c) {
		this.classes.push(c)
		return c
	}

	remove(c) {
		this.classes.remove(c)
	}
}
