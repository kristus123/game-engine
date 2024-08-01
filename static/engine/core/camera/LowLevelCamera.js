export class LowLevelCamera {
	constructor() {

		this.palette = Palette.offscreen()

		this.position = new Position(0, 0)

		this.offset = {
			x: Palette.width / 2,
			y: Palette.height / 2,
		}

		this.zoom =  1
	}

	context(run) {
		this.palette.ctx.save()

		this.palette.ctx.translate(
			-this.position.x * this.zoom + this.offset.x,
			-this.position.y * this.zoom + this.offset.y)

		this.palette.ctx.scale(this.zoom, this.zoom)

		run()

		this.palette.ctx.restore()
	}

}

