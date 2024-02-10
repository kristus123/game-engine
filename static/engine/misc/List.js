export class List {
	constructor() {

	}

	static remove(array, object) {
		const index = array.indexOf(object)

		if (index !== -1) {
			array.splice(index, 1)
			return true // Object removed successfully
		}
		else {
			return false // Object not found in the array
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
