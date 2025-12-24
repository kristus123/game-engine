export function Enhance_js_Array() {

	Enhance(Array, 'remove', function (object) {
		const index = this.indexOf(object)
		if (index !== -1) {
			this.splice(index, 1)
			return true
		}

		return false
	})


	Enhance(Array, 'next', function (current) {
		const i = this.indexOf(current)
		if (i === -1 || i === this.length - 1) {
			return null
		}

		return this[i + 1]
	})


	Enhance(Array, 'retainMax', function (maxEntries) {
		if (this.length > maxEntries) {
			this.splice(0, this.length - maxEntries)
		}
	})


	Enhance(Array, 'removeIf', function (predicate) {
		for (let i = this.length - 1; i >= 0; i--) {
			if (predicate(this[i])) {
				this.splice(i, 1)
				return true
			}
		}

		return false
	})

	Enhance(Array, 'removeIfPresent', function (e) {
		const index = this.indexOf(e)
		if (index !== -1) {
			this.splice(index, 1)
		}
	})


	Enhance(Array, 'removeOneOrThrowException', function (predicate) {
		const removed = this.removeIf(predicate)
		if (!removed) {
			throw new Error('no element removed from list')
		}
	})


	Enhance(Array, 'empty', function () {
		return this.length == 0
	})


	Enhance(Array, 'notEmpty', function () {
		return !this.empty()
	})


	Enhance(Array, 'lastIndex', function (index) {
		return index === this.length - 1
	})


	Enhance(Array, 'validIndex', function (index) {
		return index >= 0 && index < this.length
	})


	// array.includes already exists
	Enhance(Array, 'contains', function (e) {
		return this.includes(e)
	})

	Enhance(Array, 'missing', function (e) {
		return !this.includes(e)
	})

	Enhance(Array, 'addIfNotPresent', function (o) {
		if (!this.includes(o)) {
			this.push(o)
		}
	})

	Enhance(Array, 'addIfMissing', function (o) {
		if (!this.includes(o)) {
			this.push(o)
		}
	})


	Enhance(Array, 'assertNoNullElements', function () {
		for (const c of this) {
			if (c == null) {
				throw new Error('null passed into list')
			}
		}
	})

}
