export class Enemy extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

		this.localObjects = new LocalObjects([
			Init(this, {
				sprite: G.sprite.enemy(position),
			}),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
