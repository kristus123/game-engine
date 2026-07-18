function _compareOrdered(a, b, path) {
	const changes = []

	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		if (i >= a.length) {
			changes.push({
				add: true,
				set: false,
				remove: false,
				path,
				value: b[i]
			})
		}
		else if (i >= b.length) {
			changes.push({
				add: false,
				set: false,
				remove: true,
				path: [...path, i]
			})
		}
		else {
			changes.push(...a[i].diff(b[i], [...path, i]))
		}
	}

	return changes
}

function _compareUnordered(a, b, path) {
	const changes = []
	const unmatched = [...b]

	for (const value of a) {
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





export function Enhance_js_Object() {

	Enhance(Object.prototype, "merge", function (otherObject) {
		const overlapping = Object.keys(this).filter(key => key in otherObject)
		if (overlapping.length > 0) {
			throw new Error(`keys are overlapping while merging objects: ${overlapping.join(", ")}`)
		}

		return { ...this, ...otherObject }
	})

	Enhance(Object.prototype, "forEach", function (run) {
		for (const [key, value] of Object.entries(this)) {
 			run(key, value)
		}

		return this
	})

	Enhance(Object.prototype, "forEachValue", function (run) {
		for (const [key, value] of Object.entries(this)) {
 			run(value)
		}

		return this
	})

	Getter(Object.prototype, "all", function () {
		return Object.entries(this)
	})


	Enhance(Object.prototype, "map", function (fn) {
		return Object.entries(this).map(([k, v]) => fn(k, v))
	})

	Enhance(Object.prototype, "mapKeys", function (fn) {
		return Object.entries(this).map(([k, v]) => fn(k))
	})

	Enhance(Object.prototype, "mapValues", function (fn) {
		return Object.entries(this).map(([k, v]) => fn(v))
	})

	// Getter(Object.prototype, "keys", function () {
	// 	const r = []

	// 	for (const k of Object.keys(this)) {
	// 		r.add(k)
	// 	}

	// 	return r
	// })

	Getter(Object.prototype, "values", function () { // todo does this override native .values() method?
		const r = []

		for (const v of Object.values(this)) {
			r.add(v)
		}

		return r
	})

	Enhance(Object.prototype, "assertKeyMissing", function (key) {
		if (Object.hasOwn(this, key)) {
			throw new Error("Key is present in object")
		}
		else {
			return this
		}
	})

	Enhance(Object.prototype, "assertKeyNotPresent", function (key) {
		return this.assertKeyMissing(key)
	})

	Enhance(Object.prototype, "assertKeyPresent", function (key) {
		if (!Object.hasOwn(this, key)) {
			throw new Error("Key is not present in object")
		}
		else {
			return this
		}
	})

	Getter(Object.prototype, "className", function () {
		return this.constructor.name
	})

	Enhance(Object.prototype, "path", function (path_x, value) {
		let obj = this

		for (let i = 0; i < path_x.length - 1; i++) {
			if (obj == null || !(path_x[i] in obj)) {
				throw new Error(`Path not found: ${path_x.join(".")}`)
			}

			obj = obj[path_x[i]]
		}

		const key = path_x[path_x.length - 1]

		if (obj == null || !(key in obj)) {
			throw new Error(`Path not found: ${path_x.join(".")}`)
		}

		if (arguments.length >= 2) {
			obj[key] = value
			return null
		}

		return obj[key]
	})

	Enhance(Object.prototype, "applyDiff", function (diff) {
		if (diff.add) {
			let target = this

			for (let i = 0; i < diff.path.length; i++) {
				target = target[diff.path[i]]
			}

			target.push(diff.value)
		}
		else if (diff.set) {
			let target = this

			for (let i = 0; i < diff.path.length - 1; i++) {
				target = target[diff.path[i]]
			}

			target[diff.path.at(-1)] = diff.value
		}
		else if (diff.remove) {
			let target = this

			for (let i = 0; i < diff.path.length - 1; i++) {
				target = target[diff.path[i]]
			}

			if (Array.isArray(target)) {
				target.splice(diff.path.at(-1), 1)
			}
			else {
				delete target[diff.path.at(-1)]
			}
		}
		else {
			throw new Error("unsupported type: " + diff.type)
		}
	})

	Enhance(Object.prototype, "diff", function (other, path=[]) {
		Assert.validJson(this)
		Assert.validJson(other)

		if (Object.is(this, other)) {
			return []
		}

		if (typeof this != "object" || typeof other != "object" || this == null || other == null) {
			return [{
				add: false,
				set: true,
				remove: false,
				path,
				value: other
			}]
		}

		Assert.bothArrayOrObject(this, other)

		const changes = []

		if (Array.isArray(this) && Array.isArray(other)) {
			if (String(path.at(-1)).startsWith("unordered_")) {
				return _compareUnordered(this, other, path)
			}
			else {
				return _compareOrdered(this, other, path)
			}
		}

		if (Array.isArray(this) != Array.isArray(other)) {
			return [{
				add: false,
				set: true,
				remove: false,
				path,
				value: other
			}]
		}

		for (const key of new Set([...Object.keys(this), ...Object.keys(other)])) {
			if (!(key in this)) {
				changes.push({
					add: false,
					set: true,
					remove: false,
					path: [...path, key],
					value: other[key]
				})
			}
			else if (!(key in other)) {
				changes.push({
					add: false,
					set: false,
					remove: true,
					path: [...path, key]
				})
			}
			else {
				changes.push(...this[key].diff(other[key], [...path, key]))
			}
		}

		return changes
	})

}

