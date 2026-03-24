export class HashList {
	constructor() {
		this.list = [] // store { key, value } objects
	}

	add(key, value) {
		for (const item of this.list) {
  	if (item.key === key) {
    	item.value = value
    	return
  	}
		}

		this.list.push({ key, value })
	}

	get(keyOrObj) {
		for (const item of this.list) {
  	if (item.key === keyOrObj || item.value === keyOrObj) {
    	return item.value
  	}
		}
		return undefined
	}

	remove(keyOrObj) {
		for (let i = 0; i < this.list.length; i++) {
  	const item = this.list[i]
  	if (item.key === keyOrObj || item.value === keyOrObj) {
    	this.list.splice(i, 1)
    	return
  	}
		}
	}

	keys() {
		return this.list.map(item => item.key)
	}

	values() {
		return this.list.map(item => item.value)
	}
}
