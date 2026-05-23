export class LightSource {

	static shadowColor = "black"
	static shadowOpacity = 1

	static update() {
		Palette.light.fill(this.shadowColor, this.shadowOpacity)
	}

	static removeShadow(x, y, radius = 1500) {
		const ctx = Palette.light.ctx

		// THIS ERASES PIXELS (creates transparency)
		ctx.globalCompositeOperation = "destination-out"

		const g = ctx.createRadialGradient(x, y, 0, x, y, radius)
		g.addColorStop(0, "rgba(255,255,255,1)")
		g.addColorStop(1, "rgba(255,255,255,0)")

		ctx.fillStyle = g
		ctx.beginPath()
		ctx.arc(x, y, radius, 0, Math.PI * 2)
		ctx.fill()
	}

	static add(x, y, radius, color = "255,255,255", intensity = 1) {

		const ctx = Palette.light.ctx

		this.removeShadow(x,y,radius)

		// THIS ADDS LIGHT (does NOT erase anything)
		// alternative: "lighter" for stronger additive blending
		ctx.globalCompositeOperation = "screen"

		const g = ctx.createRadialGradient(x, y, 0, x, y, radius)

		g.addColorStop(0, `rgba(${color},${intensity})`)
		g.addColorStop(1, `rgba(${color},0)`)

		ctx.fillStyle = g
		ctx.beginPath()
		ctx.arc(x, y, radius, 0, Math.PI * 2)
		ctx.fill()
	}
}
