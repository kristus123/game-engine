export class World {
	constructor() {
		this.objects = Objects([
			this.player = Player(WorldPosition(0, 0)),
			Sprite.snow(D3, WorldPosition(0, 0), 4),
			Sprite.box(D3, WorldPosition(200, 200)),
		])
		for (const p of WorldPosition(0, 0, 500, 500).randomPoints(100, 20, 20)) {
			G.stones.add(new Stone(p))
		}
		G.lightSource = WorldPosition(100, 100)
		Controller.control(this.player)
		Camera.follow(this.player)
	}

	update() {
		this.objects.update()
		G.stones.update()
		//Normal map test: uncomment to see dynamic lighting effect


		//const t = Date.now() / 1000
		//G.lightSource.x = 200 + Math.cos(t) * 150
		//G.lightSource.y = 200 + Math.sin(t) * 150
	}
}
