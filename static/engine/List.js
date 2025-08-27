export class List {

	static remove(list, object) {
		const index = list.indexOf(object)

		if (index !== -1) {
			list.splice(index, 1)
			return true // Object removed successfully
		}
		else {
			return false // Object not found in the array
		}
	}

	static next(list, current) {
		const i = list.indexOf(current)
		if (i === -1 || i === list.length - 1) {
			return null
		}
		return list[i + 1]
	}


	static retainMax(list, maxEntries) {
		if (list.length > maxEntries) {
			list.splice(0, list.length - maxEntries)
		}
	}

	static removeIf(list, predicate) {
		for (let i = list.length - 1; i >= 0; i--) {
			if (predicate(list[i])) {
				list.splice(i, 1)
				// console.log('removed item')
				return true
			}
		}

		console.log('no element removed from list')
	}

	static removeOneOrThrowException(list, predicate) {
		const removed = this.removeIf(list, predicate)

		if (!removed) {
			throw new Error('no element removed from list')
		}
	}

	static empty(list) {
		return list == null || list.length == 0
	}

	static notEmpty(list) {
		return !this.empty(list)
	}

	static lastIndex(list, index) {
		return index === list.length - 1
	}

	static validIndex(list, index) {
		return index >= 0 && index < list.length
	}

	// static includes(list, o) {
	// 	return list.includes(o)
	// }

	static contains(list, o) {
		return list.includes(o)
	}

	static addIfNotPresent(list, o) {
		if (!list.includes(o)) {
			list.push(o)
		}
	}

	static assertNoNullElements(list) {
		for (const c of list) {
			if (c == null) {
				throw new Error('null passed into list')
			}
		}
	}

}
