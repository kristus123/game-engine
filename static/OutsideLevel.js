export class OutsideLevel {
	constructor(player, cameraFollow, mouse) {
		this.player = player
		this.mouse = mouse
		this.gun = new Gun(this.player)

		this.spaceship = new Spaceship()
		this.npc = new Npc(this.player)

		this.splash = new Splash(this.player)

		this.extensions = new LoadExtensions([
			new FetchContainerExtension(this.spaceship, this.npc),
			new EnterVehicleExtension(this.player, this.spaceship, cameraFollow),
			this.npc,
			new Planets(),
			this.splash
		])

		this.pp = new PrettyParticles()
	}

	update() {
		this.extensions.update()

		if (this.mouse.down) {
			console.log('hei')
		}
	}

	draw(ctx) {
		this.extensions.draw(ctx)
	}
}
