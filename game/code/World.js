// ClientId(

export class World {
	constructor() {
		this.x = Sprite.snow(Position(-0, 0), 7)
		this.objects = [
			this.x,
			this.x.tilemaps,
			this.player = DynamicGameObject(Position(8000, 8000)),
			Sprite.player(this.player.position),
		]
		this.x = Sprite.snow(Position(-0,0), 7)
		this.objects = [
			this.x,
			this.x.tilemaps,
			this.player = DynamicGameObject(Position(8000, 8000)),
			Sprite.player(this.player.position),
		]

		this.objects = new LocalObjects([
			this.snow = Sprite.snow(Position(0, 0), 7),
			this.player = DynamicGameObject(Position(0, 0)),
			Sprite.player(this.player.position),
			this.colliders = Colliders([]),
			this.topTrees = [],
		])

		for (const t of this.snow.tilemaps.tiles) {
			if (t.i == 1) {
			}
		}

		Camera.followInstantly(Mouse.position)
		Controller.control(this.player)
		OtherClients.onJoin(() => {
			console.log('Somebody Joined')
		})

		for (const t of this.snow.tilemaps.tiles) {
			if (t.i == 1) {
				this.snow.picture.setPixel(t.pp(3, 7))
			}
		}
	}

	update() {
		this.objects.update()
		D1.lightSource(Position(0, 0))
		this.colliders.enforce(this.player)
	}

	draw(draw) {}
}
