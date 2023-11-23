export class OutsideLevel {
	constructor(player, cameraFollow, mouse) {
		this.player = player
		this.mouse = mouse
		this.projectile = new Projectile()

		this.spaceship = new Spaceship()
		this.npc = new Npc(this.player)

		this.physics = new Physics()
		this.physics.applyPhysics(this.npc),
		this.physics.applyPhysics(this.projectile)
		this.physics.applyPhysics(this.player)
		this.physics.applyPhysics(this.spaceship)

		this.extensions = new LoadExtensions([
			new FetchContainerExtension(this.spaceship, this.npc),
			new EnterVehicleExtension(this.player, this.spaceship, cameraFollow),
			this.npc,
			new Planets(),
		])

		this.animation = new Animation()

		this.pp = new PrettyParticles()
		mouse.clickEvents.addOnClick('slingshot', mousePosition => {
			this.projectile.shoot(this.player, mousePosition)
			this.pp = new PrettyParticles()
			this.animation.reset()
		})

	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	update() {
		if (this.projectile.connectedTo) {
			Physics.applyAttraction(this.player, this.projectile.connectedTo)
		}

		this.extensions.update()
	}

	draw(ctx) {
		this.projectile.draw(ctx)
		this.extensions.draw(ctx)

		if (this.animation.active) {
			this.pp.updateAndDraw(ctx, this.player.x, this.player.y)
			Draw.circle(ctx, this.player.x, this.player.y, 10, 'red')
		}
	}
}
