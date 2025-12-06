export class Loop {
	static lastUpdated = 0

	static everyFrame(run) {

		function loop(currentTimestamp) {
			// Sleep(Random.integerBetween(0, 50)) // to simulate lag

			DeltaTime.update()

			run(DeltaTime.value)

			requestAnimationFrame(loop)
		}

		requestAnimationFrame(loop)
	}
}
