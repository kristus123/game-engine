export class LazyLoop {
	constructor(elements, on) {
		this.done = false

		this.index = 0
		this.started = false
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
		if (!this.started) {
			this.on.onNext(this.elements.first)
			this.started = true
		}
		if (!this.done) {
			this.on.onUpdate?.(this.element)
		}
	}

}
