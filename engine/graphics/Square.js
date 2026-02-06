export class Square extends Entity {
	constructor(position, size, run=() => {}) {
		super(position, 10, 10)
		this.position.width = size
		this.position.height = size

		run(this)
	}

	update() {
		D1.rectangle(this.position, this.color || 'white')
	}
}
