export class LazyLoop {
	constructor(elements, { onNext, onFinish, onUpdate } = {}) {
		this.index = 0
		this.completed = false
	}

	get element() {
		return this.elements[this.index]
	}

	get next() {
		this.index += 1

		if (this.index < this.elements.length) {
			this.onNext?.(this.element)
		}
		else {
			this.onFinish?.()
			this.completed = true
		}
	}

	update() {
		if (!this.completed) {
			this.onUpdate?.(this.element)
		}
	}

}
