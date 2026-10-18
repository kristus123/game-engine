export class Enhance_js_Array extends NativeEnhancer {

	constructor() {
		super(Array.prototype)
	}

	remove(object) {
		const index = this.indexOf(object)
		if (index != -1) {
			this.splice(index, 1)
			return true
		}

		return false
	}

	removeMany(elements) {
		for (const e of elements) {
			this.remove(e)
		}

		return this
	}

	valuePresent(value) {
		return this.includes(value)
	}

	shuffle() {
		const a = [...this]

		do {
			for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[a[i], a[j]] = [a[j], a[i]]
			}
		} while (this.same(a))

		return a
	}

	same(o) {
		Assert.array(o)

		return this.length == o.length
			&& this.every((value, index) => value == o[index])
	}

	unorderedDiff(other, path=[]) {
		Assert.array(other)
		const changes = []
		const unmatched = [...other]

		for (const value of this) {
			const match = unmatched.findIndex(candidate =>
				value.diff(candidate, path).length == 0
			)

			if (match == -1) {
				changes.push({
					add: false,
					set: false,
					remove: true,
					path,
					value
				})
			}
			else {
				unmatched.splice(match, 1)
			}
		}

		for (const value of unmatched) {
			changes.push({
				add: true,
				set: false,
				remove: false,
				path,
				value
			})
		}

		return changes
	}

	get first() {
		Assert.notEmpty(this)
		return this[0]
	}

	retainMax(maxEntries) {
		if (this.length > maxEntries) {
			this.splice(0, this.length - maxEntries)
		}
	}

	removeIf(predicate) {
		for (let i = this.length - 1; i >= 0; i--) {
			if (predicate(this[i])) {
				this.splice(i, 1)
				return true
			}
		}

		return false
	}

	removeIfPresent(e) {
		const index = this.indexOf(e)
		if (index != -1) {
			this.splice(index, 1)
		}
	}

	except(e) {
		// todo verify it works
		return [...this].filter(c => c != e)
	}

	removeOneOrThrowException(predicate) {
		const removed = this.removeIf(predicate)
		if (!removed) {
			throw new Error("no element removed from list")
		}
	}


	get empty() {
		return this.length == 0
	}



	get notEmpty() {
		return !this.empty
	}

	random() {
		return Random.choice(this)
	}

	get last() {
		Assert.notEmpty(this)
		return this.at(-1)
	}



	// array.includes already exists
	contains(e) {
		return this.includes(e)
	}

	missing(e) {
		return !this.includes(e)
	}

	addIfNotPresent(o) {
		if (!this.includes(o)) {
			this.push(o)
		}
	}

	addIfMissing(o) {
		if (!this.includes(o)) {
			this.push(o)
		}
	}

	add(o) {
		this.push(o)
		return o
	}

	containsAll(...args) {
		return args.every(element => this.includes(element))
	}

	assertEmpty() {
		if (this.empty) {
			return this
		}
		else {
			throw new Error("ASSERT: list should be empty")
		}
	}

	assertValues() {
		if (this.notEmpty) {
			return this
		}
		else {
			throw new Error("ASSERT: list should not be empty")
		}
	}

	assertNoNullElements() {
		for (const c of this) {
			if (c == null) {
				throw new Error("null passed into list")
			}
		}
	}

	assertNotPresent(e) {
		for (const c of this) {
			if (c == e) {
				throw new Error("value already present in array")
			}
		}
	}

	assertPresent(e) {
		for (const c of this) {
			if (c == e) {
				return "ok"
			}
		}

		throw new Error("value not present in array")
	}

	assertLength(n) {
		if (this.length != n) {
			throw new Error("length mismash")
		}

		return this
	}

	clear() {
		this.length = 0
	}

	update() {
		for (const x of this) {
			x.update()
		}
	}

	isLastIndex(index) {
		return index == this.length - 1
	}

	validIndex(index) {
		return index >= 0 && index < this.length
	}

	nextIndex(index) {
		this._currentIndex ??= index ?? -1

		if (this.empty) {
			throw new Error("Cannot get next index of an empty array")
		}

		if (this._currentIndex == this.length - 1) {
			return null
		}

		return ++this._currentIndex
	}

	nextElement(index) {
		return this[this.nextIndex(index)]
	}

	nextIndexCyclic(index) {
		this._currentIndex ??= index ?? -1

		if (this.empty) {
			throw new Error("Cannot get next index of an empty array")
		}

		this._currentIndex = (this._currentIndex + 1) % this.length

		return this._currentIndex
	}

	nextElementCyclic(index) {
		return this[this.nextIndexCyclic(index)]
	}
}
