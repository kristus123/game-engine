export class Loop {
	static lastUpdated = 0

	static everyFrame(run) {

		function loop() {
			// Sleep(Random.integerBetween(0, 100)) // to simulate lag

			DeltaTime.update()

			run()

			requestAnimationFrame(loop)
		}

		requestAnimationFrame(loop)
	}
}
