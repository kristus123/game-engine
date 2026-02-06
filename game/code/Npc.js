export class Npc extends Entity {
	constructor(position) {
		super(position, 10, 3)

		this.localObjects = Objects([
			Init(this, {
				sprite: G.Sprite.player(position),
			}),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
