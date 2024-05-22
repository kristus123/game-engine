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

	static removeIf(list, predicate) {
		for (let i = list.length - 1; i >= 0; i--) {
			if (predicate(list[i])) {
				list.splice(i, 1)
			}
		}
	}

	static lastIndex(list, index) {
		return index === list.length - 1
	}

	static validIndex(list, index) {
		return index >= 0 && index < list.length
	}

	static includes(list, o) {
		return list.includes(o)
	}

}
