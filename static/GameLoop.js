class GameLoop {

	static start(width, height) {
		const {canvas, ctx} = Canvas.main(width, height)
		const {hiddenCanvas, hiddenCtx} = Canvas.hidden(width, height)

		const anotherCanvas = new OffscreenCanvas(width, height);
		const anotherContext = anotherCanvas.getContext('2d');

		AnimationLoop.start(deltaTime => {

			anotherContext.save()
			hiddenCtx.save()

			hiddenCtx.fillStyle = "black"
			hiddenCtx.fillRect(0, 0, width, height)

			GameLoop.eachFrame(hiddenCtx, [hiddenCtx, anotherContext], deltaTime);
			Draw.rectangle(anotherContext, -1000, 10, 100, 100)

			hiddenCtx.restore()
			anotherContext.restore()

			hiddenCtx.drawImage(anotherCanvas.transferToImageBitmap(), 0, 0);
			ctx.drawImage(hiddenCanvas, 0, 0)
		})

		return canvas
	}
}
