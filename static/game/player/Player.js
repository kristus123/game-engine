export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 400)

		this.localObjects = new LocalObjects([
			this.sprite = G.Sprite.p2(this.position, 1),
			this.jump = new Jump(this),

			OnChange(() => this.movingUp, up => {
				if (up) {
					this.sprite.up.loop()
				}
				else {
					this.sprite.idle.loop()
				}
			}),

			OnChange(() => this.direction, d => {
				this.sprite.tags[d].loop()
			}),
		])

		for (const p of new Tilemaps().turretTiles) {
			G.walkableAreas.add(p)
		}
	}

	update() {
		this.localObjects.update()

		this.position.scale(this.jump.scale)

		for (const w of G.invisibleWalls) {
			w.enforce(G.player)
		}

	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		G.walkableAreas.enforce(G.player)
	}
}
