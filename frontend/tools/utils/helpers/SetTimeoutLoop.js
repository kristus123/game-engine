export function SetTimeoutLoop(delayMs = 1_000, run) {
	let timeout = null
	let active = true
	let pendingRun = null

	async function loop() {
		if !active || pendingRun != null {
			return
		}

		timeout = null
		pendingRun = Promise.resolve().then(() => {
			if active {
				return run()
			}
		})

		try {
			await pendingRun
		}
		catch (error) {
			console.warn("Timeout loop failed", error)
		}
		finally {
			pendingRun = null
			if active {
				timeout = setTimeout(loop, delayMs)
			}
		}
	}

	const controller = {
		stop: () => {
			active = false
			clearTimeout(timeout)
			timeout = null
			return controller
		},
		start: () => {
			if !active {
				active = true
				loop()
			}
			return controller
		},
	}

	return controller.start()
}
