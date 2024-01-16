export class Spaceship extends GameObject {
	constructor(player) {
		super(-1200, 0, 300, 300, 10, 25)
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

	update() {
	}

	draw(ctx) {
		this.picture.r(ctx)

		if (this.entered) {
		}
		else {
			if (Distance.withinRadius(this.player, this, 100)) {
				Draw.new_text(ctx, this.position, 'E to enter')
			}
		}
	}
}
