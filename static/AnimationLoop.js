class AnimationLoop {
	static start(run) {
		function loop(deltaTime) {
			run(deltaTime)
			requestAnimationFrame(loop)
		}

		requestAnimationFrame(loop)
	}
	
}
