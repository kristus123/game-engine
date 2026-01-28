// ClientId(

export class World {
	constructor() {
		Page.go(LandingPage)
		this.x = Sprite.snow(Position(-0, 0), 7)
		this.objects = [
			this.x,
			this.x.tilemaps,
			this.player = DynamicGameObject(Position(8000, 8000)),
			Sprite.player(this.player.position),
		]
		this.x = Sprite.snow(Position(-0, 0), 7)
		this.objects = [
			this.x,
			this.x.tilemaps,
			this.player = DynamicGameObject(Position(8000, 8000)),
			Sprite.player(this.player.position),
		]

		this.objects = new LocalObjects([
			this.snow = Sprite.snow(Position(0, 0), 7),
			this.player = DynamicGameObject(Position(600, 200)),
			Sprite.samurai(this.player.position),
			this.colliders = Colliders([]),
		])
		this.topTrees = this.snow.picture.copy()
		this.topTrees.clear()

		Camera.followInstantly(this.player)
		Controller.control(this.player)
		OtherClients.onJoin(() => {
			console.log('Somebody Joined')
		})

		for (const t of this.snow.tilemaps.tiles) {
			if (t.i == 1) {
				const xxx = t.pixelPosition(3, 7)
				this.colliders.positions.add(xxx)
				for (const p of [
					{ x: 2, y: 3 },
					{ x: 4, y: 5 },
					{ x: 3, y: 5 },
					{ x: 4, y: 4 },
					{ x: 2, y: 5 },
					{ x: 3, y: 4 },
					{ x: 2, y: 4 },
					{ x: 3, y: 3 },
					{ x: 4, y: 3 },
					{ x: 3, y: 6 },
				]) {
					this.snow.picture.move(t.pp(p.x, p.y), this.topTrees)
				}
			}
		}
	}

	update() {
		this.objects.update()
		D1.lightSource(Position(0, 0))
		this.colliders.enforce(this.player)
		this.topTrees.draw()
		this.colliders.update()
	}

	draw(draw) {}
}
