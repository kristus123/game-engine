export function Every(intervalMs, action, maxRuns='infinite', onFinish=() => {}) {

	const stopWatch = new StopWatch()

	let totalRuns = 0

	return new class {
		update() {
			if (maxRuns != 'infinite' && totalRuns >= maxRuns) {
				onFinish()
				this.removeFromLoop()
			}
			else if (stopWatch.moreThan(intervalMs)) {
				action()
				totalRuns += 1
				stopWatch.restart()
			}
		}

		draw(draw) {
		}
	}
}
