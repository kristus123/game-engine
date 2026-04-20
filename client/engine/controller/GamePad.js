function reduceDecimals(num) {
	return Math.round(num * 100) / 100
}

export class GamePad {

	static {
		window.addEventListener("gamepadconnected", (e) => {
			console.log("Gamepad connected:", e.gamepad)
		})

		window.addEventListener("gamepaddisconnected", (e) => {
			console.log("Gamepad disconnected:", e.gamepad)
		})
	}

	static update() {
		for (const gp of navigator.getGamepads()) {
			if (gp && gp.index == 1) {

				const x = reduceDecimals(gp.axes[0])
				const y = reduceDecimals(gp.axes[1])

				const deadzone = 0.4

				this.left = x < -deadzone
				this.right = x > deadzone

				this.up = y < -deadzone
				this.down = y > deadzone
			}
		}
	}
}
