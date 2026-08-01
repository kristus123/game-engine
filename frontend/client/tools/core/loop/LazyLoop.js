export class LazyLoop {
	constructor(elements, on) {
		this.done = false

		this.on.onNext(this.elements.first)
		this.index = 0
	}

	get element() {
		if (this.elements.empty) {
			throw new Error("list is empty")
		}
		else {
			return this.elements[this.index]
		}
	}

	next() {
		this.index += 1

		if (this.index < this.elements.length) {
			this.on.onNext(this.element)
		}
		else {
			this.on.onFinish?.()
			this.done = true
		}
	}

	update() {
		if (!this.done) {
			this.on.onUpdate?.(this.element)
		}
	}

}
