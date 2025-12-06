module.exports = class {

	static remove(list, o) {
		for (let i = list.length - 1; i >= 0; i--) {
			if (list[i] === o) {
				list.splice(i, 1)
				break
			}
		}
	}
}
