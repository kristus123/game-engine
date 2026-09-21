export class LocalValue {

	constructor(key, defaultValue) {
		if (localStorage.getItem(key) == null) {
			if (A.method(defaultValue)) {
				defaultValue = defaultValue()
			}
			localStorage.setItem(key, defaultValue)
		}
	}

	get value() {
		return localStorage.getItem(this.key)
	}

	set value(val) { // no-null-check
		localStorage.setItem(this.key, val)
	}

}
