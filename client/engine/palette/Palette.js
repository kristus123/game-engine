export class Palette {

	static {
		const canvas = document.createElement("canvas")
		document.getElementById("canvases").appendChild(canvas)

		const ctx = canvas.getContext("2d")

		TestResizeObserver(canvas, (width, height) => {
			const dpr = window.devicePixelRatio || 1;

			canvas.width = canvas.clientWidth * dpr;
			canvas.height = canvas.clientHeight * dpr;

			ctx.scale(dpr, dpr);

			ctx.imageSmoothingEnabled = false
		})

		this.main = {
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
