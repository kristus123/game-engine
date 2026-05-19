export class LazyLoop {
	constructor(elements, on) {
		this.index = 0
		this.completed = false

		this.on.onNext(this.element)
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
			this.completed = true
		}
	}

	update() {
		if (!this.completed) {
			this.on.onUpdate?.(this.element)
		}
		else {
			// find out if this ever happens. it should not. after that remove if block
			throw new Error("i dont want update to ever be triggered when completed")
		}
	}

}
