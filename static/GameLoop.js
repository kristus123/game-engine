class GameLoop {

	static update = (ctx, canvas, deltaTime) => {
		console.log("replace me")
	}

	static draw = (ctx, canvas, deltaTime) => {
		console.log("replace me")
	}

	static start() {
		const canvas = document.getElementById("game")
		canvas.width = 1280
		canvas.height = 720

		const ctx = canvas.getContext("2d")


		let lastTimestamp = performance.now();
		
		function gameLoop(currentTimestamp) {
			const deltaTime = (currentTimestamp - lastTimestamp) / 1000; // Convert to seconds
			lastTimestamp = currentTimestamp;

			ctx.save()
			ctx.fillStyle = "black"
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			GameLoop.update(ctx, canvas, deltaTime);
			GameLoop.draw(ctx, canvas, deltaTime);

			ctx.restore()

			requestAnimationFrame(gameLoop);
		}

		requestAnimationFrame(gameLoop);


		return {ctx, canvas}
	}
}
