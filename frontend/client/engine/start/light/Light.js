export class Light {

	static sources = []

	static updateInsideCameraContext() {
		for (const s of this.sources) {
			this._drawLight(s)
		}
	}

	static add(position, radius=100, color = "255,255,255", intensity = 1) {
		const s = {
			position: position,
			radius: radius,
			color: color,
			intensity: intensity,
			remove: () => {
				this.sources.remove(s)
			},
		}

		this.sources.add(s)

		return s
	}

	static _drawLight(source) {

		const { x, y } = source.position
		const { radius, color, intensity } = source

		const ctx = Palette.light.ctx

		Shadow.remove(source)

		ctx.globalCompositeOperation = "destination-out"

		const g = ctx.createRadialGradient(
			x, y, 0,
			x, y, radius
		)

		g.addColorStop(0, `rgba(0,0,0,${intensity})`)
		g.addColorStop(1, `rgba(0,0,0,0)`)

		ctx.fillStyle = g

		ctx.beginPath()
		ctx.arc(x, y, radius, 0, Math.PI * 2)
		ctx.fill()

		ctx.globalCompositeOperation = "source-over"
	}


}
