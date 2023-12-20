export class MainLevel {
	constructor(camera, mouse) {
		this.mouse = mouse
		this.controller = new Controller(this.player)

		this.player = new Player(mouse, this.controller)
		camera.follow(this.player)

		this.npc = new Npc(mouse)
		this.controller.control(this.player)

		this.runAll = new RunAll('mainlevel', [
			this.player,
			this.controller,
			this.npc,
			new Piss(this.player, this.mouse),
		])

	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
