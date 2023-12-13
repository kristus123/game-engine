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
	
}
