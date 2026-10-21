export class G {
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
}
