function _improvedStickValue(num) {
	const d = Math.round(num * 100) / 100

	const deadzone = 0.4
	return d.abs >= deadzone ? d : 0
}

export class GamePad {

	static controllers = {}

	static {
		window.addEventListener("gamepadconnected", e => {
			const gamepad = e.gamepad

			if (gamepad.mapping != "standard") {
				throw new Error("wow. what controller is the player using?")
			}

			const button = {}

			for (const [index, btn] of gamepad.buttons.entries()) {
				const listener = Listener()

				const onChange = OnChange(
					() => btn.pressed,
					v => listener.trigger(v))

				const name = PlaystationMapper(index)
				button[name] = {
					name: name,
					index: index,
					listener: listener,
					onChange: onChange,
				}
			}

			this.controllers[gamepad.index] = {
				index: gamepad.index,
				gamepad,
				button,
				leftStick: { x: 0, y: 0 },
				rightStick: { x: 0, y: 0 },
			}
		})

		window.addEventListener("gamepaddisconnected", e => {
			delete this.controllers[e.gamepad.index]
		})
	}

	static update() {
		for (const { leftStick, gamepad, button, index } of this.controllers.values) {

			for (const { onChange } of button.values) {
				onChange.update()
			}

			leftStick.x = _improvedStickValue(gamepad.axes[0])
			leftStick.y = _improvedStickValue(gamepad.axes[1])
		}
	}

}
