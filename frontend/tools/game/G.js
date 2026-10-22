export class G {
	// year
	static _year = ValueListener(0)

	static get year() {
		return this._year.value
	}

	static set year(y) {
		this._year.value = y
	}

	static onYear(callback) {
		this._year.listen(callback)
	}
	// year

	// wood
	static _wood = ValueListener(0)

	static get wood() {
		return this._wood.value
	}

	static set wood(y) {
		this._wood.value = y
	}

	static onWood(callback) {
		this._wood.listen(callback)
	}
	// wood
	
}
