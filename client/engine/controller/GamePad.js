function _improvedStickValue(num) {
	const d = Math.round(num * 100) / 100

	const deadzone = 0.4
	return d.abs >= deadzone ? d : 0
}

export class GamePad {

	static controllers = {}

	static {
		window.addEventListener("gamepadconnected", e => {
			console.log("gamepad connected")
			const gamepad = e.gamepad
			setInterval(() => {
				for (const b of gamepad.buttons) {
					if (b.pressed) {
						console.log(b)
					}
				}
			}, 100)


			if (gamepad.mapping != "standard") {
				throw new Error("wow. what controller is the player using?")
			}

			const buttons = {}

			for (const [index, button] of gamepad.buttons.entries()) {
				const listener = Listener()


				const name = PlaystationMapper(index)

				const onChange = OnChange(
					() => button.pressed,
					v => {
						console.log(`pressed: ${name}`)
						listener.trigger(v)
					})

				buttons[name] = {
					button: button,
					name: name,
					index: index,
					listen: callback => listener.listen(callback),
					onChange: onChange,
				}
			}

			this.controllers[gamepad.index] = {
				index: gamepad.index,
				gamepad,
				buttons,
				leftStick: { x: 0, y: 0 },
				rightStick: { x: 0, y: 0 },
			}

			Gp.onConnect(this.controllers[gamepad.index])
		})

		window.addEventListener("gamepaddisconnected", e => {
			delete this.controllers[e.gamepad.index]
		})
	}

	static update() {
		for (const { leftStick, gamepad, buttons, index } of this.controllers.values) {

			for (const { onChange, button, name } of buttons.values) {
				if (button.pressed == true) {
					console.log(name)
				}
				onChange.update()
			}

			leftStick.x = _improvedStickValue(gamepad.axes[0])
			leftStick.y = _improvedStickValue(gamepad.axes[1])
		}
	}

}
