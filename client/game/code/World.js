export class World {
	constructor() {
		// Page.go(PracticePage)

		this.p = Sprite.viking(WorldPosition(0, 0))
		// Camera.follow(Entity(WorldPosition(1000, 200)))
	}

	update() {
		this.p.update()
		console.log(Mouse.position)
	}
}
