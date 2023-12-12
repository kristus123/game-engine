export class MainLevel {
	constructor(cameraFollow, mouse) {
		this.mouse = mouse
		this.player = new Player(mouse)
		this.controller = new Controller(this.player)

		this.spaceship = new Spaceship(mouse)
		this.npc = new Npc(this.player)

		this.splash = new Splash(this.player)

		this.extensions = new LoadExtensions([
			new FetchContainerExtension(this.spaceship),
			new EnterVehicleExtension(this.player, this.spaceship, cameraFollow),
			this.npc,
			new Planets(),
			this.splash
		])
	}

	update() {
		this.extensions.update()
	}

	draw(ctx) {
		Draw.new_circle(ctx, this.mouse.position)

		this.extensions.draw(ctx)
	}
}
