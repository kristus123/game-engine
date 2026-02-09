export class HelperThing {
	constructor(classes=[]) {
		Assert.noNullInArray(classes)
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

}
