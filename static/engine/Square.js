export class Square extends DynamicGameObject {
	constructor(position, size, run=() => {}) {
		super(position, 10, 10)
		this.position.width = size
		this.position.height = size

		run(this)
	}


	draw(draw, guiDraw) {
		draw.rectangle(this.position, 'white')
	}
}
