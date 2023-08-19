class AnimationLoop {

	static fps = 0

	static everyFrame(run) {
		let lastTimestamp = performance.now();

		function loop(currentTimestamp) {
			const deltaTime = (currentTimestamp - lastTimestamp) / 1000
			lastTimestamp = currentTimestamp;

			run(deltaTime)
			AnimationLoop.fps = Math.floor(Math.floor(1000 / deltaTime) / 1000)

			requestAnimationFrame(loop)
		}

		requestAnimationFrame(loop)
	}
	
}
