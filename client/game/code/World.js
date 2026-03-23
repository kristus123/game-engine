export class World {
	constructor() {
		this.objects = Objects([
			this.player = Player(WorldPosition(0, 0)),
			Sprite.snow(D3, WorldPosition(0, 0), 4)
		])

		Controller.control(this.player)
		Camera.follow(this.player)
		setInterval(() => {
		}, 200)
		// this.player.pushTowards(Mouse.position, 100)
	}

	update() {
		this.objects.update()
		if (Mouse.down) {
		}
	}
}
