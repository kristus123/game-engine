export class LocalValue {

	constructor(key, defaultValue) {
		if (localStorage.getItem(key) === null) {
			localStorage.setItem(key, JSON.stringify(defaultValue))
		}
	}

	get value() {
		const item = localStorage.getItem(this.key)
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
