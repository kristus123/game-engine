export class Poop extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

		this.position.width = 40
		this.position.height = 40

		this.localObjects = Objects([
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
		draw.brown(this)

		if (Mouse.hovering(this)) {
			this.remove()
		}
	}
}
