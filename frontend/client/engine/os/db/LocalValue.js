export class LocalValue {

	constructor(key, defaultValue) {
	}

	get value() {
		const item = localStorage.getItem(this.key)
		if (item === null) {
			return this.defaultValue
		}
		try {
			return JSON.parse(item)
		} catch (e) {
			return item
		}
	}

	set value(val) {
		localStorage.setItem(this.key, JSON.stringify(val))
	}

}
