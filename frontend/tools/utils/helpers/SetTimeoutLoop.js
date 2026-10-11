export function SetTimeoutLoop(run, delayMs = 1_000) {
	let timeout = null
	let stopped = false

	async function loop() {
		if (stopped) {
			return
		}
		try {
			await run()
		}
		catch (error) {
			console.warn("Timeout loop failed", error)
		}
		if (!stopped) {
			timeout = setTimeout(loop, delayMs)
		}
	}
	loop()

	return {
		stop: () => {
			stopped = true
			clearTimeout(timeout)
		},
	}
}
