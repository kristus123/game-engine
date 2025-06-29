export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 200)

		this.localObjects = new LocalObjects([
			G.Sprite.player(this.position, 5),
			new Throw(() => new ChickenFood(this.position.copy())),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
