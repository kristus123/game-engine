export class Spaceship extends DynamicGameObject {
	constructor(player, camera, controller) {
		super(new Position(-120, 0, 300, 300), 10, 25)
		this.player = player
		this.picture = new Picture(this, 'https://www.nicepng.com/png/full/13-138961_vector-spaces-ship-8-bit-spaceship-sprite.png')

		this.entered = false
		new KeypressEvent().addKeyDownListener('e', () => {
			if (this.entered) {
				this.entered = false
				Call(this.onExit)
				this.player.x = this.x
				this.player.y = this.y
			}
			else if (Distance.withinRadius(this.player, this, 100)) {
				this.entered = true
				Call(this.onEnter)
			}
		})

	}

	draw(draw, guiDraw) {
		draw.ctx.save()

		draw.ctx.translate(this.position.center.x, this.position.center.y)
		const rotationAngle = Math.atan2(this.velocity.y, this.velocity.x)
		draw.ctx.rotate(rotationAngle)
		draw.ctx.rotate(Math.PI / rotation) // 90 degrees

		draw.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height)

		draw.ctx.restore()


		if (!this.entered && Distance.withinRadius(this.player, this, 100)) {
			draw.new_text(this.position, 'E to enter')
		}
	}
}