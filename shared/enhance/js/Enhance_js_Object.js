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

export class Enhance_js_Object extends NativeEnhancer {
	constructor() {
		super(Object.prototype, {
			excludedMembers: typeof process != "undefined" && process.versions?.node != null ? ["path"] : [],
		})
	}

	merge(otherObject) {
		const overlapping = Object.keys(this).filter(key => key in otherObject)
		if (overlapping.length > 0) {
			throw new Error(`keys are overlapping while merging objects: ${overlapping.join(", ")}`)
		}

		return { ...this, ...otherObject }
	}

	forEach(run) {
		for (const [key, value] of Object.entries(this)) {
 			run(key, value)
		}

		return this
	}

	forEachValue(run) {
		for (const [key, value] of Object.entries(this)) {
 			run(value)
		}

		return this
	}

	get all() {
		return Object.entries(this)
	}

	get empty() {
		return Object.keys(this).length == 0
	}


	map(fn) {
		return Object.entries(this).map(([k, v]) => fn(k, v))
	}

	mapKeys(fn) {
		return Object.entries(this).map(([k, v]) => fn(k))
	}

	mapValues(fn) {
		return Object.entries(this).map(([k, v]) => fn(v))
	}

	// was uncommented by nabir to use in SfuRouters
	get keys() {
		const r = []

		for (const k of Object.keys(this)) {
			r.add(k)
		}

		return r
	}

	get values() { // todo does this override native .values() method?
		const r = []

		for (const v of Object.values(this)) {
			r.add(v)
		}

		return r
	}

	assertKeyMissing(key) {
		if (Object.hasOwn(this, key)) {
			throw new Error("Key is present in object")
		}
		else {
			return this
		}
	}

	assertKeyNotPresent(key) {
		return this.assertKeyMissing(key)
	}

	assertKeyPresent(key) {
		if (!Object.hasOwn(this, key)) {
			throw new Error("Key is not present in object")
		}
		else {
			return this
		}
	}

	get className() {
		return this.constructor.name
	}

	// Node's URL resolver reads `path` from URL objects, so install this only in browsers.
	path(path_x, value) {
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
	}

	applyDiff(diff) {
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
	}

	diff(other, path=[]) {
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
				return this.unorderedDiff(other, path)
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
	}

}
