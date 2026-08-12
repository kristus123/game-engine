export function RequestAnimationFrameLoop(run) {

	let frame = null
	let playing = true

	function loop() {
		if (playing) {
			run()
		}

		frame = requestAnimationFrame(loop)
	}

	frame = requestAnimationFrame(loop)

	return {
		pause: () => {
			playing = false
		},
		resume: () => {
			playing = true
		},
		stop: () => {
			cancelAnimationFrame(frame)
		},
	}
}
