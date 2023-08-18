class GameLoop {

	static start(width, height) {
		const {canvas, ctx} = Canvas.main(width, height)
		const {hiddenCanvas, hiddenCtx} = Canvas.hidden(width, height)

		let lastTimestamp = performance.now();

		AnimationLoop.start(currentTimestamp => {

			const deltaTime = (currentTimestamp - lastTimestamp) / 1000
			lastTimestamp = currentTimestamp;

			hiddenCtx.save()
			hiddenCtx.fillStyle = "black"
			hiddenCtx.fillRect(0, 0, width, height)

			GameLoop.update(hiddenCtx, deltaTime);
			GameLoop.draw(hiddenCtx);

			hiddenCtx.restore()

			ctx.drawImage(hiddenCanvas, 0, 0)
		})

		return {hiddenCtx, canvas}
	}
}
