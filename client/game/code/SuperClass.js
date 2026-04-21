function format(t) {
	return ` - [${t}] - `
}

export class SuperClass {
	static all = []

	constructor() {
		this.tags = ""

		SuperClass.all.push(this)
	}

	showTags() {
		if (this.tags && this.position) {
			D1.text(this.position, this.tags, "white", 20)
		}
	}

	addTag(tag) {
		this.removeTag(tag)
		this.tags += format(tag)

	}

	removeTag(tag) {
		this.tags = this.tags.replace(format(tag), "")
	}
}
