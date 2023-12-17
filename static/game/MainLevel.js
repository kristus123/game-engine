export class MainLevel {
	constructor(cameraFollow, mouse) {
		this.mouse = mouse
		this.controller = new Controller(this.player)
		this.player = new Player(mouse, this.controller)

		this.spaceship = new Spaceship(mouse)
		this.npc = new Npc(this.player)

		this.extensions = new LoadExtensions(this, [
			new Fleet(this.player),
			new FetchContainerExtension(this.spaceship),
			new EnterVehicleExtension(this.player, this.spaceship, cameraFollow),
			this.npc,
			new Planets(),
		])
	}

	update() {
		this.extensions.update()
	}

	draw(ctx) {
		this.extensions.draw(ctx)
	}
}
