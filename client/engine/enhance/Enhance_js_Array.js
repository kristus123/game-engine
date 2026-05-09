export function Enhance_js_Array() {

	Enhance(Array.prototype, "remove", function (object) {
		const index = this.indexOf(object)
		if (index !== -1) {
			this.splice(index, 1)
			return true
		}

		return false
	})

	Enhance(Array.prototype, "next", function (current) {
		const i = this.indexOf(current)
		if (i === -1 || i === this.length - 1) {
			return null
		}

		return this[i + 1]
	})

	Enhance(Array.prototype, "retainMax", function (maxEntries) {
		if (this.length > maxEntries) {
			this.splice(0, this.length - maxEntries)
		}
	})

	Enhance(Array.prototype, "removeIf", function (predicate) {
		for (let i = this.length - 1; i >= 0; i--) {
			if (predicate(this[i])) {
				this.splice(i, 1)
				return true
			}
		}

		return false
	})

	Enhance(Array.prototype, "removeIfPresent", function (e) {
		const index = this.indexOf(e)
		if (index !== -1) {
			this.splice(index, 1)
		}
	})

	Enhance(Array.prototype, "removeOneOrThrowException", function (predicate) {
		const removed = this.removeIf(predicate)
		if (!removed) {
			throw new Error("no element removed from list")
		}
	})


	Getter(Array.prototype, "empty", function () {
		return this.length == 0
	})



	Getter(Array.prototype, "notEmpty", function () {
		return !this.empty()
	})

	Enhance(Array.prototype, "random", function () {
		return Random.choice(this)
	})


	Enhance(Array.prototype, "lastIndex", function (index) {
		return index === this.length - 1
	})


	Enhance(Array.prototype, "validIndex", function (index) {
		return index >= 0 && index < this.length
	})


	// array.includes already exists
	Enhance(Array.prototype, "contains", function (e) {
		return this.includes(e)
	})

	Enhance(Array.prototype, "missing", function (e) {
		return !this.includes(e)
	})

	Enhance(Array.prototype, "addIfNotPresent", function (o) {
		if (!this.includes(o)) {
			this.push(o)
		}
	})

	Enhance(Array.prototype, "addIfMissing", function (o) {
		if (!this.includes(o)) {
			this.push(o)
		}
	})

	Enhance(Array.prototype, "add", function (o) {
		this.push(o)
	})

	Enhance(Array.prototype, "assertNoNullElements", function () {
		for (const c of this) {
			if (c == null) {
				throw new Error("null passed into list")
			}
		}
	})

	Enhance(Array.prototype, "assertNotPresent", function (e) {
		for (const c of this) {
			if (c == e) {
				throw new Error("value already present in array")
			}
		}
	})

	Enhance(Array.prototype, "assertPresent", function (e) {
		for (const c of this) {
			if (c == e) {
				return "ok"
			}
		}

		throw new Error("value not present in array")
	})

	Enhance(Array.prototype, "assertLength", function (n) {
		if (this.length != n) {
			throw new Error("length mismash")
		}

		return this
	})

	Enhance(Array.prototype, "clear", function () {
		this.length = 0
	})

	Enhance(Array.prototype, "update", function () {
		for (const x of this) {
			x.update()
		}
	})


}
