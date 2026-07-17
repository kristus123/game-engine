function _compareOrdered(a, b, path) {
	const changes = []

	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		if (i >= a.length) {
			changes.push({
				type: Diff.set,
				path: [...path, i],
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
			changes.push(...compare(a[i], b[i], [...path, i]))
		}
	}

	return changes
}

function _compareUnordered(a, b, path) {
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
    		type: Diff.set,
    		path,
    		value
		})
	}

	return changes
}

export const DiffHelpers = {
	_compareOrdered,
	_compareUnordered,
}
