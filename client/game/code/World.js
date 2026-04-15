export class World {
	constructor() {
		// Page.go(PracticePage)

		this.viking = Sprite.viking(WorldPosition(-800, 0))
		this.player = Sprite.player(WorldPosition(200, 300))
		// Camera.follow(Entity(WorldPosition(1000, 200)))
	}

	update() {
		this.viking.update()
		this.player.update(D2)
	}
}
