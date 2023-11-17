export class OutsideLevel {
	constructor(player, cameraFollow, mouse) {
		this.player = player
		this.mouse = mouse
		this.projectile = new Projectile()

		this.spaceship = new Spaceship()

		this.physics = new Physics()
		this.physics.applyPhysics(this.projectile)
		this.physics.applyPhysics(this.player)
		this.physics.applyPhysics(this.spaceship)

		this.extensions = new LoadExtensions([
			new Npc(this.player),
			new FetchContainerExtension(this.spaceship),
			new EnterVehicleExtension(this.player, this.spaceship, cameraFollow),
		])

		addEventListener('click', (e) => {
			this.projectile.shoot(
				this.player,
				mouse.positionRelativeToCamera(e),
			)
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
		Draw.text(ctx, 120, 0, 100, 100, 'outside level')
		this.projectile.draw(ctx)
		this.extensions.draw(ctx)
	}
}
