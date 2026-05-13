function format(t) {
	return ` - [${t}] - `
}

// this class is added to all classes by the transpiler
// decide if BaseClass or SuperClass is the best

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

	hasTag(tag) {
		return this.tags.includes(format(tag))
	}

	removeTag(tag) {
		this.tags = this.tags.replace(format(tag), "")
	}

	ofType(t) { // returns true for subclasses as well
		return this instanceof t
	}

	assertOfType(t) { // returns true for subclasses as well
		if (!this.ofType(t)) {
			throw new Error("not of type " + t)
		}
		else {
			return this
		}
	}

	isClass(ClassRef) { // strict check
		return this.constructor == ClassRef
	}

	get className() {
		return this.constructor.name
	}

	assertClass(c) {
		if (!this.isClass(c)) {
			throw new Error(`${this.className} is not of type ${c}`)
		}
		else {
			return this
		}
	}

}

