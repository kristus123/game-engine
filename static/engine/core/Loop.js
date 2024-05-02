function sleep(milliseconds) {
	const date = Date.now()
	let currentDate = null
	do {
		currentDate = Date.now()
	} while (currentDate - date < milliseconds)
}


export class Loop {
	static fps = 0
	static lastUpdated = 0

	static everyFrame(run) {
		let lastTimestamp = performance.now()

		function loop(currentTimestamp) {
			// sleep(Random.integerBetween(0, 500))

			const deltaTime = (currentTimestamp - lastTimestamp) / 1000
			lastTimestamp = currentTimestamp

			run(deltaTime)


			if (Loop.lastUpdated > 10) {
				Loop.fps = Math.floor(Math.floor(1000 / deltaTime) / 1000)
				Loop.lastUpdated = 0
			}
			else {
				Loop.lastUpdated += 1
			}

			requestAnimationFrame(loop)
		}

		requestAnimationFrame(loop)
	}
}
