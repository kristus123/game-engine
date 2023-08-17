class GameLoop {

	static update = (ctx, deltaTime) => {
		console.log("replace me")
	}

	static draw = (ctx) => {
		console.log("replace me")
	}

	static start(width, height) {
		const canvas = document.getElementById("game")
		canvas.width = width
		canvas.height = height
		const ctx = canvas.getContext("2d")

		const hiddenCanvas = document.createElement("canvas");
		hiddenCanvas.width = width;
		hiddenCanvas.height = height;
		const hiddenCtx = hiddenCanvas.getContext("2d");

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

		return {bufferCtx: hiddenCtx, canvas}
	}
}
