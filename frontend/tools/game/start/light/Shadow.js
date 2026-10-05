export class Shadow {

	static color = "black"
	static opacity = 1.0

	static remove(source) {
		const { x, y } = source.position
		const { radius, color, intensity } = source

		if (intensity > 0) {
			const ctx = Palette.light.ctx

			ctx.globalCompositeOperation = "destination-out" // THIS ERASES PIXELS (creates transparency)

			const g = ctx.createRadialGradient(x, y, 0, x, y, radius)
			g.addColorStop(0, "rgba(255,255,255,1)")
			g.addColorStop(1, "rgba(255,255,255,0)")

			ctx.fillStyle = g
			ctx.beginPath()
			ctx.arc(x, y, radius, 0, Math.PI * 2)
			ctx.fill()
		}
	}

	static updateOutsideCameraContext() {
		Palette.light.fill(this.color, this.opacity)
	}

}
