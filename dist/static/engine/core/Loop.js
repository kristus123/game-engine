import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Sleep } from '/static/engine/core/Sleep.js'; 

export class Loop {
	static fps = 0
	static lastUpdated = 0

	static everyFrame(run) {
		let lastTimestamp = performance.now()

		function loop(currentTimestamp) {
			// Sleep(Random.integerBetween(0, 500))

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
