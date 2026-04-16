export class Palette {

	static main() {
		const canvas = document.createElement("canvas")
		document.getElementById("canvases").appendChild(canvas)

		const ctx = canvas.getContext("2d")
		ctx.imageSmoothingEnabled = false

		TestResizeObserver(canvas, (width, height) => {
			canvas.width = width
			canvas.height = height

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

}
