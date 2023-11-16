
export class OutsideLevel {
	constructor(player, cameraFollow, mouse) {
		this.physics = new Physics()
		this.player = player
		this.mouse = mouse
		this.projectile = new Projectile()
		this.physics.applyPhysics(this.projectile)
		this.physics.applyPhysics(this.player)

		this.spaceship = new Spaceship()
		this.physics.applyPhysics(this.spaceship)

		this.enterVehicleExtension = new EnterVehicleExtension(
			this.player,
			this.spaceship,
			cameraFollow,
		)
		this.fetchContainerExtension = new FetchContainerExtension(
			this.spaceship,
		)

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

		this.enterVehicleExtension.update()
		this.fetchContainerExtension.update()
	}

	draw(ctx) {
		Draw.text(ctx, 120, 0, 100, 100, 'outside level')
		this.enterVehicleExtension.draw(ctx)
		this.fetchContainerExtension.draw(ctx)
		this.projectile.draw(ctx)
	}
}
