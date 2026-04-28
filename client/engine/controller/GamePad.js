function onlyTwoDecimals(num) {
	return Math.round(num * 100) / 100
}

export class GamePad {

	static active = false

	static x = 0
	static y = 0

	static {
		window.addEventListener("gamepadconnected", (e) => {
			console.log("Gamepad connected:", e.gamepad)

			buttons = {}
			for (const [i, v] of e.gamepad.buttons.entries()) {
				const listener = Listener()

				const onChange = OnChange(
					() => button.value,
					v => listener.trigger(v))

				buttons[i] = {
					listener: listener,
					onChange: 
				}
			}

			this.controllers[e.gamepad.index] = buttons
		})

		window.addEventListener("gamepaddisconnected", (e) => {
			console.log("Gamepad disconnected:", e.gamepad)
			this.active = false
		})

	}

	static update() {
		for (const gp of navigator.getGamepads()) {
			if (gp && gp.index == 1) {
				this.active = true

				const x = onlyTwoDecimals(gp.axes[0])
				const y = onlyTwoDecimals(gp.axes[1])

				const deadzone = 0.4

				this.x = x.abs >= deadzone ? x : 0
				this.y = y.abs >= deadzone ? y : 0
			}
		}

		this.objects.update()
	}

}
