export class SlingshotExtension {
	constructor(mouse, player) {
		this.projectile = new Projectile(player, 10, 'red')

		document.addEventListener('click', (e) => {
			this.projectile.shoot(
				player,
				mouse.positionRelativeToCamera(e),
			)
		})
	}

	update() {
		if (this.projectile.connectedTo) {
			Physics.enforceMaxDistance(this.player, this.projectile.connectedTo)
		}
	}

	draw(draw, guiDraw) {
		this.projectile.draw(draw, guiDraw)
	}
}
