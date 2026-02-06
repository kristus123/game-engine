export class World {
	constructor() {
		this.objects = Objects([
			this.player = Player(WorldPosition(0,0)),
			Sprite.snow(D3, WorldPosition(0,0,), 4)
		]) 
		Controller.control(this.player)
		for(const p of Random.positions(WorldPosition(0,0, 500, 500), 100)) {
			p.width = 20
			p.height = 20
			G.stones.add(new Stone(p))
		}
	}

	update() {
		this.objects.update()
		G.stones.update()
	}
}
