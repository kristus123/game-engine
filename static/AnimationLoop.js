class AnimationLoop {


	static start(run) {
		let lastTimestamp = performance.now();

		function loop(currentTimestamp) {
			const deltaTime = (currentTimestamp - lastTimestamp) / 1000
			lastTimestamp = currentTimestamp;

			run(deltaTime)
			requestAnimationFrame(loop)
		}

		requestAnimationFrame(loop)
	}
	
}
