export class MainLevel {
	constructor(cameraFollow, mouse) {
		this.player = new Player(mouse, this.controller)
		this.controller = new Controller(this.player)
		this.controller.control(this.player)
	}

	update() {
		this.player.update()
		this.controller.update()
	}

	draw(ctx) {
		this.player.draw(ctx)
	}
}
