export function CanvasLayer(canvas) { // no-null-check
	canvas ??= new OffscreenCanvas(1, 1)
	const ctx = canvas.getContext("2d")

	return {
		canvas,
		ctx,

		resize(width, height, scale) {
			const pixelWidth = Math.max(1, Math.round(width * scale))
			const pixelHeight = Math.max(1, Math.round(height * scale))

			if canvas.width != pixelWidth || canvas.height != pixelHeight {
				canvas.width = pixelWidth
				canvas.height = pixelHeight
			}

			ctx.setTransform(pixelWidth / Math.max(1, width), 0, 0, pixelHeight / Math.max(1, height), 0, 0)
			ctx.imageSmoothingEnabled = false
		},

		clear() {
			ctx.save()
			ctx.resetTransform()
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.restore()
		},

		fill(color, opacity = 1) {
			ctx.save()
			ctx.resetTransform()
			ctx.globalCompositeOperation = "source-over"
			ctx.globalAlpha = opacity
			ctx.fillStyle = color
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			ctx.restore()
		},
	}
}
