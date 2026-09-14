export function Enhance_js_Array() {

	Enhance(Array.prototype, "remove", function (object) {
		const index = this.indexOf(object)
		if (index != -1) {
			this.splice(index, 1)
			return true
		}

		return false
	})

	Enhance(Array.prototype, "removeMany", function (elements) {
		for (const e of elements) {
			this.remove(e)
		}

		return this
	})

	Enhance(Array.prototype, "valuePresent", function (value) {
		return this.includes(value)
	})

	Enhance(Array.prototype, "shuffle", function () {
		const a = [...this]

		do {
			for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[a[i], a[j]] = [a[j], a[i]]
			}
		} while (this.same(a))

		return a
	})

	Enhance(Array.prototype, "same", function (o) {
		Assert.array(o)

		return this.length == o.length
			&& this.every((value, index) => value == o[index])
	})

	Getter(Array.prototype, "first", function () {
		Assert.notEmpty(this)
		return this[0]
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
		if (index != -1) {
			this.splice(index, 1)
		}
	})

	Enhance(Array.prototype, "except", function (e) {
		// todo verify it works
		return [...this].filter(c => c != e)
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



	Getter(Array.prototype, "last", function () {
		Assert.notEmpty(this)
		return this.at(-1)
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

	Enhance(Array.prototype, "containsAll", function (...args) {
		return args.every(element => this.includes(element))
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

	Enhance(Array.prototype, "isLastIndex", function (index) {
		return index == this.length - 1
	})

	Enhance(Array.prototype, "validIndex", function (index) {
		return index >= 0 && index < this.length
	})

	Getter(Array.prototype, "nextIndex", function () {
		this._currentIndex ??= -1

		if (this.empty) {
			throw new Error("Cannot get next index of an empty array")
		}

		if (this._currentIndex == this.length - 1) {
			return null
		}

		return ++this._currentIndex
	})

	Getter(Array.prototype, "nextElement", function () {
		return this[this.nextIndex]
	})

	Getter(Array.prototype, "nextIndexCyclic", function () {
		this._currentIndex ??= -1

		if (this.empty) {
			throw new Error("Cannot get next index of an empty array")
		}

		this._currentIndex = (this._currentIndex + 1) % this.length

		return this._currentIndex
	})

	Getter(Array.prototype, "nextElementCyclic", function () {
		return this[this.nextIndexCyclic]
	})
}
