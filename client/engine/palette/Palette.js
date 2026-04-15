export class Palette {

	static offscreenCanvases = []

	static main() {
		const canvas = document.createElement("canvas")
		document.getElementById("canvases").appendChild(canvas)

		const ctx = canvas.getContext("2d")

		ctx.imageSmoothingEnabled = false

		TestResizeObserver(canvas, (width, height) => {
			canvas.width = width
			canvas.height = height

			for (const c of this.offscreenCanvases) {
				c.width = width
				c.height = height

				const ctx = c.getContext("2d")
				ctx.imageSmoothingEnabled = false
			}

			const ctx = canvas.getContext("2d")
			ctx.imageSmoothingEnabled = false
		})

		return {
			apply: p => {
				ctx.drawImage(p.canvas, 0, 0)
			},
			clear: () => {
				ctx.clearRect(0, 0, Screen.width, Screen.height)
			},
			canvas,
			ctx,
			fill: (color, opacity = 1) => {
				ctx.globalAlpha = opacity
				ctx.fillStyle = color
				ctx.fillRect(0, 0, Screen.width, Screen.height)
				ctx.globalAlpha = 1
			},
		}
	}

	static offscreen() {
		const canvas = new OffscreenCanvas(Screen.width, Screen.height)
		const ctx = canvas.getContext("2d")

		ctx.imageSmoothingEnabled = false

		this.offscreenCanvases.push(canvas)

		return {
			canvas,
			ctx,
			draw: Draw(ctx),
			clear: () => {
				ctx.clearRect(0, 0, Screen.width, Screen.height)
			},
			apply: (p) => {
				ctx.drawImage(p.canvas, 0, 0)
			},
			fill: (color, opacity = 1) => {
				ctx.globalAlpha = opacity
				ctx.fillStyle = color
				ctx.fillRect(0, 0, Screen.width, Screen.height)
				ctx.globalAlpha = 1
			},
		}
	}

}
