export class Npc extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 3)

		this.localObjects = new LocalObjects([
			Init(this, {
				sprite: G.Sprite.player(position),
			}),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw() {
		this.localObjects.draw()
	}
}
