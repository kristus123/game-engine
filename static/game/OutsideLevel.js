export class OutsideLevel {
	constructor(cameraFollow, mouse) {
		this.player = new Player(mouse)
		this.controller = new Controller(this.player)

		this.mouse = mouse
		this.gun = new Gun(this.player)

		this.spaceship = new Spaceship()
		this.npc = new Npc(this.player)

		this.splash = new Splash(this.player)

		this.extensions = new LoadExtensions([
			new FetchContainerExtension(this.spaceship),
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
		Draw.circle(ctx, this.mouse.position.x, this.mouse.position.y, 10, 'red')

		this.extensions.draw(ctx)
	}
}
