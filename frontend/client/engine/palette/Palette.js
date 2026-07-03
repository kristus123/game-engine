export class Palette {
	static renderScale = 2 // engine’s internal drawing scale level: 1 to 5 means 1/1 to 1/5 of the visible size

	static get renderScaleFactor() {
		return 1 / this.renderScale
	}

	static {
		function xxx() {
			const lightCanvas = new OffscreenCanvas(1, 1)
			const lightCtx = lightCanvas.getContext("2d")

			return {
				canvas: lightCanvas,
				ctx: lightCtx,

				resize: (width, height) => {
					const dpr = Math.max(1, window.devicePixelRatio || 1)
					const scaledWidth = Math.round(width * Palette.renderScaleFactor)
					const scaledHeight = Math.round(height * Palette.renderScaleFactor)

					lightCanvas.width = scaledWidth * dpr
					lightCanvas.height = scaledHeight * dpr

					lightCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
					lightCtx.imageSmoothingEnabled = false
				},

				clear: () => {
					lightCtx.clearRect(0, 0, lightCanvas.width, lightCanvas.height)
				},

				fill: (color, opacity = 1) => {
					lightCtx.globalAlpha = opacity
					lightCtx.fillStyle = color
					lightCtx.fillRect(0, 0, lightCanvas.width, lightCanvas.height)
					lightCtx.globalAlpha = 1
				},
			}

		}

		this.light = xxx()
		this.d1 = xxx()
		this.d2 = xxx()
		this.d3 = xxx()

		const canvas = document.createElement("canvas")
		document.getElementById("canvases").appendChild(canvas)

		const ctx = canvas.getContext("2d")

		TestResizeObserver(canvas, (width, height) => {
			const dpr = Math.max(1, window.devicePixelRatio || 1)
			const scaledWidth = Math.max(1, Math.round(width * Palette.renderScaleFactor))
			const scaledHeight = Math.max(1, Math.round(height * Palette.renderScaleFactor))

			canvas.width = scaledWidth * dpr
			canvas.height = scaledHeight * dpr

			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
			ctx.imageSmoothingEnabled = false

			this.light.resize(scaledWidth, scaledHeight)
			this.d1.resize(scaledWidth, scaledHeight)
			this.d2.resize(scaledWidth, scaledHeight)
			this.d3.resize(scaledWidth, scaledHeight)
		})

		this.main = {
			canvas,
			ctx,

			clear: () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height)
			},

			fill: (color, opacity = 1) => {
				ctx.globalAlpha = opacity
				ctx.fillStyle = color
				ctx.fillRect(0, 0, canvas.width, canvas.height)
				ctx.globalAlpha = 1
			},

			apply: (layer, mode = "source-over") => {
				ctx.save()
				ctx.setTransform(1, 0, 0, 1, 0, 0)
				ctx.drawImage(layer.canvas, 0, 0, canvas.width, canvas.height)
				ctx.restore()
			},
		}
	}
}
