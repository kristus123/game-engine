class AnimationLoop {

	static fps = 0
	static lastUpdated = 0

	static everyFrame(run) {
		let lastTimestamp = performance.now();

		function loop(currentTimestamp) {
			const deltaTime = (currentTimestamp - lastTimestamp) / 1000
			lastTimestamp = currentTimestamp;

			run(deltaTime)
			if (AnimationLoop.lastUpdated > 10) {
				AnimationLoop.fps = Math.floor(Math.floor(1000 / deltaTime) / 1000)
				AnimationLoop.lastUpdated = 0
			} else {
				AnimationLoop.lastUpdated += 1
			}

			requestAnimationFrame(loop)
		}

		requestAnimationFrame(loop)
	}
}
