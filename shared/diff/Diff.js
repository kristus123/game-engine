function _compareOrdered(a, b, path) {
	const changes = []

	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		if (i >= a.length) {
			changes.push({
				type: Diff.add,
				path,
				value: b[i]
			})
		}
		else if (i >= b.length) {
			changes.push({
				type: Diff.remove,
				path: [...path, i]
			})
		}
		else {
			changes.push(...Diff.compare(a[i], b[i], [...path, i]))
		}
	}

	return changes
}

function _compareUnordered(a, b, path) {
	const changes = []
	const unmatched = [...b]

	for (const value of a) {
		const match = unmatched.findIndex(candidate =>
			Diff.compare(value, candidate, path).length == 0
		)

		if (match == -1) {
			changes.push({
				type: Diff.remove,
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
			type: Diff.add,
			path,
			value
		})
	}

	return changes
}

export class Diff {

	static add = "DIFF_TYPE_ADD"
	static set = "DIFF_TYPE_SET"
	static remove = "DIFF_TYPE_REMOVE"

	static setThing(object, path, value) {
		let target = object

		for (let i = 0; i < path.length - 1; i++) {
			target = target[path[i]]
		}

		target[path.at(-1)] = value
	}

	static addThing(object, path, value) {
		let target = object

		for (let i = 0; i < path.length; i++) {
			target = target[path[i]]
		}

		target.push(value)
	}

	static removeThing(object, path) {
		let target = object

		for (let i = 0; i < path.length - 1; i++) {
			target = target[path[i]]
		}

		if (Array.isArray(target)) {
			target.splice(path.at(-1), 1)
		}
		else {
			delete target[path.at(-1)]
		}
	}

	static compare(a, b, path = []) {
		Assert.validJson(a)
		Assert.validJson(b)

		if (Object.is(a, b)) {
			return []
		}

		if (typeof a != "object" || typeof b != "object" || a == null || b == null) {
			return [{
				type: Diff.set,
				path,
				value: b
			}]
		}

		Assert.bothArrayOrObject(a, b)

		const changes = []

		if (Array.isArray(a) && Array.isArray(b)) {
			if (String(path.at(-1)).startsWith("unordered_")) {
				return _compareUnordered(a, b, path)
			}
			else {
				return _compareOrdered(a, b, path)
			}
		}

		if (Array.isArray(a) != Array.isArray(b)) {
			return [{
				type: Diff.set,
				path,
				value: b
			}]
		}

		for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
			if (!(key in a)) {
				changes.push({
					type: Diff.set,
					path: [...path, key],
					value: b[key]
				})
			}
			else if (!(key in b)) {
				changes.push({
					type: Diff.remove,
					path: [...path, key]
				})
			}
			else {
				changes.push(...Diff.compare(a[key], b[key], [...path, key]))
			}
		}

		return changes
	}
}

const client = { users: {} }
const server = { users: { swags: 1 } }

for (const d of Diff.compare(client, server)) {
	console.log(d)

	if (d.type == Diff.set) {
		// client.applyDiff(d)
		// client.path(d.path, d.value)
		Diff.setThing(client, d.path, d.value)
	}
	else if (d.type == Diff.add) {
		// client.applyDiff(d)
		Diff.addThing(client, d.path, d.value)
	}
	else if (d.type == Diff.remove) {
		Diff.removeThing(client, d.path)
	}
	else {
		throw new Error("unsupported type: " + d.type)
	}
}

console.log(client)
console.log(server)
console.log("hei")
