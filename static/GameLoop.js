class GameLoop {

	static start(width, height) {
		const {canvas, ctx} = Canvas.main(width, height)
		const {hiddenCanvas, hiddenCtx} = Canvas.hidden(width, height)

		const offscreenCanvas = new OffscreenCanvas(width, height);
		const offscreenContext = offscreenCanvas.getContext('2d');

		AnimationLoop.start(deltaTime => {

			offscreenContext.save()
			hiddenCtx.save()

			hiddenCtx.fillStyle = "black"
			hiddenCtx.fillRect(0, 0, width, height)

			GameLoop.eachFrame(hiddenCtx, offscreenContext, deltaTime);

			hiddenCtx.restore()
			offscreenContext.restore()

			hiddenCtx.drawImage(offscreenCanvas.transferToImageBitmap(), 0, 0);
			ctx.drawImage(hiddenCanvas, 0, 0)
		})

		return canvas
	}
}
