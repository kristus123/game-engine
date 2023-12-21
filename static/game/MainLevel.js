export class MainLevel {
	constructor(camera, mouse) {
		this.mouse = mouse
		this.controller = new Controller(this.player)

		this.player = new Player(mouse, this.controller)
		camera.follow(this.player)

		this.npc = new Npc(mouse)
		this.controller.control(this.player)

		this.piss = new Piss(this.player, this.mouse),

		this.chat = new FirstChat(this.npc.position, this.piss, mouse)

		this.runAll = new RunAll('mainlevel', [
			this.player,
			this.controller,
			this.npc,
			this.piss,
			this.chat,
		])
	}

	update() {
		this.runAll.update()
	}

	draw(ctx) {
		this.runAll.draw(ctx)
	}
}
