export class Gp {

	static connected = false

	static onConnect(controller) {
		this.connected = true

		controller.buttons.left.listener.listen(pressed => {
			if (pressed) {
				this.onLeft()
			}
		})

		controller.buttons.right.listener.listen(pressed => {
			if (pressed) {
				this.onRight()
			}
		})
	}

	static onDisconnect() {
		this.connected = false
	}

	static onLeft = () => {}
	static onRight = () => {}
	static onUp = () => {}
	static onDown = () => {}

}
