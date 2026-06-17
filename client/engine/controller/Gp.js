function _improvedStickValue(num) {
	const d = Math.round(num * 100) / 100

	const deadzone = 0.4
	return d.abs >= deadzone ? d : 0
}

let index = null

export class Gp {

	static init() {
	}

	static {
		window.addEventListener("gamepadconnected", (e) => {
			index = e.gamepad.index
			console.log("Gamepad connected:", e.gamepad.id)
			console.log(e.gamepad)
		})

		window.addEventListener("gamepaddisconnected", () => {
			index = null
			console.log("Gamepad disconnected")
		})

		this.onTrueListeners = []
		for (const button of Playstation.buttons) {
			console.log(button)
			this[button] = () => {}
			this[button + "Pressed"] = false
			this[button + "Listener"] = OnTrue(() => this[button + "Pressed"], () => {
				this[button]?.()
			})

			this.onTrueListeners.add(this[button + "Listener"])
		}
	}

	static update() {
		if (index != null) {
			const gp = navigator.getGamepads()[index]

			for (const [i, button] of gp.buttons.entries()) {
				const name = Playstation.mapToButton(i)
				this[name + "Pressed"] = button.pressed
				if (button.pressed) {
					console.log(`${name} is pressed`)
				}
			}

			const axes = gp.axes.map(a => a.toFixed(2))
		}

		for (const onTrue of this.onTrueListeners) {
			onTrue.update()
		}

	}

}
