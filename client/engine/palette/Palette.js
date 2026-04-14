export class Palette {

	static main() {
		const canvas = document.createElement("canvas")
		document.getElementById("canvases").appendChild(canvas)

		canvas.width = Screen.width
		canvas.height = Screen.height
		const ctx = canvas.getContext("2d")

		ctx.imageSmoothingEnabled = false

		return {
			apply: p => {
				ctx.drawImage(p.canvas, 0, 0)
			},
		}
	}

	static offscreen() {
		const canvas = new OffscreenCanvas(Screen.width, Screen.height)
		const ctx = canvas.getContext("2d")

		ctx.imageSmoothingEnabled = false

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
