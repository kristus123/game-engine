export class LazyLoop {
	constructor(elements, on) {
		this.index = 0
		this.completed = false

		this.on.onNext(this.element)
	}

	get element() {
		return this.elements[this.index]
	}

	next() {
		this.index += 1

		if (this.index < this.elements.length) {
			this.on.onNext(this.element)
		}
		else {
			this.on.onFinish?.()
			this.completed = true
		}
	}

	update() {
		if (!this.completed) {
			this.on.onUpdate?.(this.element)
		}
	}

}
