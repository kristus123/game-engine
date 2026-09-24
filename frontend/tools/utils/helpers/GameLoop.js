export class GameLoop {

	static start(run) {
		return FrameLoop(() => {
			// const start = performance.now()
			//Sleep(Random.integerBetween(100, 100)) // to simulate lag

			DeltaTime.update()
			run()

			// const end = performance.now()
			// console.log(`Frame took ${(end - start).toFixed(2)} ms`)
		})
	}
}
