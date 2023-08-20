class Loop {

	static fps = 0
	static lastUpdated = 0

	static everyFrame(run) {
		let lastTimestamp = performance.now();

		function loop(currentTimestamp) {
			const deltaTime = (currentTimestamp - lastTimestamp) / 1000
			lastTimestamp = currentTimestamp;

			run(deltaTime)
			if (Loop.lastUpdated > 10) {
				Loop.fps = Math.floor(Math.floor(1000 / deltaTime) / 1000)
				Loop.lastUpdated = 0
			} else {
				Loop.lastUpdated += 1
			}

			requestAnimationFrame(loop)
		}

		requestAnimationFrame(loop)
	}
}
