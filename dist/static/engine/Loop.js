import { Random } from '/static/engine/Random.js'; 
import { Sleep } from '/static/engine/Sleep.js'; 

export class Loop {
	static fps = 0
	static lastUpdated = 0

	static everyFrame(run) {
		let lastTimestamp = performance.now()

		function loop(currentTimestamp) {
			// Sleep(Random.integerBetween(0, 500))

			// deltaTime is in seconds
			const deltaTime = (currentTimestamp - lastTimestamp) / 1000

			lastTimestamp = currentTimestamp

			run(deltaTime)

			if (Loop.lastUpdated > 10) {
				Loop.fps = Math.floor(Math.floor(1 / deltaTime))
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
