export class MainLevel {
	constructor(cameraFollow, mouse) {
		this.controller = new Controller(this.player)
		this.player = new Player(mouse, this.controller)
		this.npc = new Npc(mouse, this.controller)
		this.controller.control(this.player)
	}

	update() {
		this.player.update()
		this.controller.update()
	}

	draw(ctx) {
		this.player.draw(ctx)
		this.npc.draw(ctx)
	}
}
