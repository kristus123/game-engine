class Assert {
	static bothArrayOrObject(a, b) {
    	const aIsArray = Array.isArray(a)
    	const bIsArray = Array.isArray(b)

    	const aIsObject = a != null && typeof a == "object" && !aIsArray
    	const bIsObject = b != null && typeof b == "object" && !bIsArray

    	if ((aIsArray && bIsArray) || (aIsObject && bIsObject)) {
        	return true
    	}

    	throw new Error("Expected both values to be arrays or objects")
	}

	static validJson(value) {
    	if (["string", "number", "boolean"].includes(typeof value)) {
        	return true
    	}
		else if (Array.isArray(value)) {
        	for (const item of value) {
            	Assert.validJson(item)
        	}
        	return true
    	}
		else if (typeof value == "object") {
        	if (Object.getPrototypeOf(value) != Object.prototype) {
            	throw new Error("Invalid JSON value")
        	}

        	for (const item of Object.values(value)) {
            	Assert.validJson(item)
        	}

        	return true
    	}
		else {
			throw new Error("Invalid JSON value")
		}
	}
}

function compare(a, b, path = []) {
	Assert.validJson(a)
	Assert.validJson(b)
	Assert.bothArrayOrObject(a, b)

	if (Object.is(a, b)) {
    	return []
	}

	if (typeof a != "object" || typeof b != "object" || a == null || b == null) {
    	return [{
        	type: "replace",
        	path,
        	value: b
    	}]
	}

	const changes = []

	if (Array.isArray(a) && Array.isArray(b)) {
    	if (String(path.at(-1)).startsWith("unordered_")) {
        	return compareUnordered(a, b, path)
    	}

    	for (let i = 0; i < Math.max(a.length, b.length); i++) {
        	if (i >= a.length) {
            	changes.push({
                	type: "add",
                	path: [...path, i],
                	value: b[i]
            	})
        	}
			else if (i >= b.length) {
            	changes.push({
                	type: "remove",
                	path: [...path, i]
            	})
        	}
			else {
            	changes.push(...compare(a[i], b[i], [...path, i]))
        	}
    	}

    	return changes
	}

	if (Array.isArray(a) != Array.isArray(b)) {
    	return [{
        	type: "replace",
        	path,
        	value: b
    	}]
	}

	for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    	if (!(key in a)) {
        	changes.push({
            	type: "add",
            	path: [...path, key],
            	value: b[key]
        	})
    	}
		else if (!(key in b)) {
        	changes.push({
            	type: "remove",
            	path: [...path, key]
        	})
    	}
		else {
        	changes.push(...compare(a[key], b[key], [...path, key]))
    	}
	}

	return changes
}

function compareUnordered(a, b, path) {
	const changes = []
	const unmatched = [...b]

	for (const value of a) {
    	const match = unmatched.findIndex(candidate => compare(value, candidate, path).length == 0)

    	if (match == -1) {
        	changes.push({
            	type: "remove",
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
        	type: "add",
        	path,
        	value
    	})
	}

	return changes
}

function setPath(object, path, value) {
	let target = object

	for (let i = 0; i < path.length - 1; i++) {
    	target = target[path[i]]
	}

	target[path.at(-1)] = value
}

function removePath(object, path) {
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




const client = []

const server = [1, 2, 5, 6]

for (const x of compare(client, server)) {
	console.log(x)
	if (x.type == "replace" || x.type == "add") {
		setPath(client, x.path, x.value)
	}
	else if (x.type == "remove") {
		removePath(client, x.path)
	}
	else {
		throw new Error("unsupported type: " + x.type)
	}
}


console.log(client)
console.log(server)
