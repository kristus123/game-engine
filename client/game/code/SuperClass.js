export class SuperClass {
	static all = []

	constructor() {
		this.tags = ""

		SuperClass.all.push(this)
	}

	showTags() {
		if (this.tags && this.position) {
			D1.text(this.position, this.tags)
		}
	}

	addTag(tag) {
		this.tags += tag
		
	}

	removeTag(tag) {
		this.tags = this.tags.replace(tag, "")
	}
}
