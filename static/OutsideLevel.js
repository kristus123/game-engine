export class OutsideLevel {
	constructor(player, cameraFollow, mouse) {
		this.player = player
		this.mouse = mouse
		this.gun = new Gun(this.player)
		this.projectile = new Projectile()

		this.water = new Water(this.player)
		this.spaceship = new Spaceship()
		this.npc = new Npc(this.player)

		this.physics = new Physics()
		this.physics.applyPhysics(this.npc),

		this.physics.applyPhysics(this.projectile)
		this.physics.applyPhysics(this.player)
		this.physics.applyPhysics(this.spaceship)

		this.splash = new Splash()

		this.extensions = new LoadExtensions([
			new FetchContainerExtension(this.spaceship, this.npc),
			new EnterVehicleExtension(this.player, this.spaceship, cameraFollow),
			this.npc,
			new Planets(),
		])

		this.animation = new Animation()

		this.pp = new PrettyParticles()

		this.item = new InventoryItem()


		mouse.clickEvents.addOnClick('shoot', mousePosition => {
			this.splash.splashOpposite(this.player, mousePosition)

			const bullet = this.gun.shoot(mousePosition)
		})
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
		this.gun.updatePhysics(deltaTime)
		this.water.physics.update(deltaTime)
	}

	update() {
		if (this.projectile.connectedTo) {
			Physics.applyAttraction(this.player, this.projectile.connectedTo)
		}

		this.extensions.update()
	}

	draw(ctx) {
		Draw.circleSpinning(ctx, this.player, 50)

		this.item.draw(ctx)

		this.splash.draw(ctx)
		// this.gun.draw(ctx)
		this.water.draw(ctx, this.player)
		this.projectile.draw(ctx)
		this.extensions.draw(ctx)

		if (this.animation.active) {
			this.pp.updateAndDraw(ctx, this.player.x, this.player.y)
			Draw.circle(ctx, this.player.x, this.player.y, 10, 'red')
		}
	}
}
