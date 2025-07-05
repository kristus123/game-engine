export class Grass extends StaticGameObject {
	constructor(position) {
		super(position)

		this.trimmed = false

		this.localObjects = new LocalObjects([
			Init(this, {
				sprite: G.Sprite.grass(this.position).randomStartFrame(),
			}),

		])

		KeyDown('e', () => {
			if (!this.trimmed && this.touches(G.player)) {
				this.sprite.trimmed.loop()
				this.trimmed = G.Sprite.grass(this.position.copy())
				this.trimmed.inventory.loop()
				this.localObjects.add(this.trimmed)
				ForcePush(this.trimmed).awayFrom(G.player)
			}
		})
	}


	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
