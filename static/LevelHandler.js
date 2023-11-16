
export class LevelHandler {
	constructor(cameraFollow, mouse) {
		this.player = new Player(mouse)
		this.controller = new Controller(this.player)

		this.outsideLevel = new OutsideLevel(this.player, cameraFollow, mouse)
	}

	updatePhysics(deltaTime) {
		this.outsideLevel.updatePhysics(deltaTime)
	}

	update() {
		this.outsideLevel.update()
	}

	draw(ctx) {
		this.outsideLevel.draw(ctx)
	}
}
