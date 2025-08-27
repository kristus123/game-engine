export class Square extends DynamicGameObject {
	constructor(position, size, run=() => {}) {
		super(position, 10, 10)
		this.position.width = size
		this.position.height = size

		run(this)
	}

	update() {

	}

	draw() {
		Draw.rectangle(this.position, this.color || 'white')
	}
}
