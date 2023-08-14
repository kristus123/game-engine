class GameLoop {

	static update = (ctx, canvas, deltaTime) => {
		console.log("replace me")
	}

	static draw = (ctx, canvas, deltaTime) => {
		console.log("replace me")
	}

	static start(width, height) {
		const canvas = document.getElementById("game")
		canvas.width = width
		canvas.height = height

		const ctx = canvas.getContext("2d")


		let lastTimestamp = performance.now();
		
		function gameLoop(currentTimestamp) {
			const deltaTime = (currentTimestamp - lastTimestamp) / 1000
			lastTimestamp = currentTimestamp;

			ctx.save()
			ctx.fillStyle = "black"
			ctx.fillRect(0, 0, width, height)

			GameLoop.update(ctx, canvas, deltaTime);
			GameLoop.draw(ctx, canvas, deltaTime);

			ctx.restore()

			requestAnimationFrame(gameLoop);
		}

		requestAnimationFrame(gameLoop);

		return {ctx, canvas}
	}
}
