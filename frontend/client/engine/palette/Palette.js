export class Palette {

	static {
		function xxx() {
			const lightCanvas = new OffscreenCanvas(1, 1)
			const lightCtx = lightCanvas.getContext("2d")

			return {
				canvas: lightCanvas,
				ctx: lightCtx,

				resize: (width, height) => {
					const dpr = window.devicePixelRatio || 1
					lightCanvas.width = width * dpr
					lightCanvas.height = height * dpr

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
			const dpr = window.devicePixelRatio || 1

			canvas.width = canvas.clientWidth * dpr
			canvas.height = canvas.clientHeight * dpr

			// IMPORTANT: reset transform instead of scale accumulation
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

			ctx.imageSmoothingEnabled = false

			this.light.resize(canvas.clientWidth, canvas.clientHeight)
			this.d1.resize(canvas.clientWidth, canvas.clientHeight)
			this.d2.resize(canvas.clientWidth, canvas.clientHeight)
			this.d3.resize(canvas.clientWidth, canvas.clientHeight)
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
				// ctx.globalCompositeOperation = mode
				//ctx.drawImage(layer.canvas, 0, 0)
				// ctx.globalCompositeOperation = "source-over"
				ctx.save()
				ctx.setTransform(1, 0, 0, 1, 0, 0)
				ctx.drawImage(layer.canvas, 0, 0, canvas.width, canvas.height)
				ctx.restore()
			},
		}
	}
}
