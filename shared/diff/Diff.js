export class Diff {

	static set = "DIFF_TYPE_SET"
	static remove = "DIFF_TYPE_REMOVE"

	static setThing(object, path, value) {
		let target = object

		for (let i = 0; i < path.length - 1; i++) {
			target = target[path[i]]
		}

		target[path.at(-1)] = value
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
		Assert.bothArrayOrObject(a, b)

		if (Object.is(a, b)) { // can this be more pretty, or can it be removed?
			return []
		}

		if (typeof a != "object" || typeof b != "object" || a == null || b == null) {
			return [{
				type: Diff.set,
				path,
				value: b
			}]
		}

		const changes = []

		if (Array.isArray(a) && Array.isArray(b)) {
			if (String(path.at(-1)).startsWith("unordered_")) {
				return DiffHelpers._compareUnordered(a, b, path)
			}
			else {
				return DiffHelpers._compareOrdered(a, b, path)
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
				changes.push(...compare(a[key], b[key], [...path, key]))
			}
		}

		return changes
	}

}

const client = [8]
const server = [1, 2, 5, 6]

for (const d of Diff.compare(client, server)) {
	console.log(d)
	if (d.type == Diff.set) {
		Diff.setThing(client, d.path, d.value)
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
