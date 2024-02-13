export class SlingshotExtension {
	constructor(mouse, player) {
		this.projectile = new Projectile(this.player, 10, 'red')

		document.addEventListener('click', (e) => {
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

	draw(draw) {
		this.projectile.draw(draw)
	}
}
