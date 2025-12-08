export class Square extends DynamicGameObject {
	constructor(position, size, run=() => {}) {
		super(position, 10, 10)
		this.position.width = size
		this.position.height = size

		run(this)
	}

	update() {

	}

	draw(draw) {
		draw.rectangle(this.position, this.color || 'white')
	}
}
