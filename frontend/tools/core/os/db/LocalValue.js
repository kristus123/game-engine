export class LocalValue {

	constructor(key, defaultValue) { // no-null-check
		if (localStorage.getItem(key) == null) {
			if (A.jsonObject(defaultValue)) {
				localStorage.setItem(key, JSON.stringify(defaultValue))
			}
			else {
				localStorage.setItem(key, defaultValue)
			}
		}
	}

	get value() {
		const item = localStorage.getItem(this.key)
		if (A.jsonString(item)) {
			return JSON.parse(item)
		}
		else {
			return item
		}
	}

	set value(val) { // no-null-check
		if (A.jsonObject(val)) {
			localStorage.setItem(this.key, JSON.stringify(val))
		}
		else {
			localStorage.setItem(this.key, val)
		}
	}

}
