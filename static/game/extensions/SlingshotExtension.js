export class SlingshotExtension {
	constructor(mouse, player) {
		this.player = player

		this.projectile = new Projectile(this.player, 10, 'red')

		document.addEventListener('click', (e) => {
			console.log('shooting')
			this.projectile.shoot(
				this.player,
				mouse.positionRelativeToCamera(e),
			)
		})
	}

	update() {
		if (this.projectile.connectedTo) {
			Physics.enforceMaxDistance(this.player, this.projectile.connectedTo)
		}
	}

	draw(ctx) {
		this.projectile.draw(ctx)
	}
}
