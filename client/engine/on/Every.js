export function Every(intervalMs, action, maxRuns="infinite", onFinish=() => {}) {

	const stopWatch = StopWatch()

	let totalRuns = 0

	return new class {
		update() {
			if (maxRuns != "infinite" && totalRuns >= maxRuns) {
				onFinish()
				this.removeItself()
			}
			else if (stopWatch.moreThan(intervalMs)) {
				action()
				totalRuns += 1
				stopWatch.restart()
			}
		}
	}
}
