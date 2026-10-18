export class Enhance_html_collection extends NativeEnhancer {
	constructor() {
		super(HTMLCollection.prototype, { allowOverride: ["forEach", "map"] })
	}

	except(e) {
		return [...this].filter(c => c != e)
	}

	find(...args) {
		return Array.from(this).find(...args)
	}

	filter(...args) {
		return Array.from(this).filter(...args)
	}

	every(...args) {
		return Array.from(this).every(...args)
	}

	forEach(...args) {
		return Array.from(this).forEach(...args)
	}

	map(...args) {
		return Array.from(this).map(...args)
	}

	get last() {
		return this[this.length - 1]
	}


}
