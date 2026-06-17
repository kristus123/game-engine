export class Gp {

	static connected = false

	static onConnect(controller) {
		this.connected = true

		controller.buttons.left.listen(pressed => {
			console.log("clicked left")
			if (pressed) {
				this.left()
			}
		})

		controller.buttons.right.listen(pressed => {
			if (pressed) {
				this.right()
			}
		})
	}

	static onDisconnect() {
		this.connected = false
	}

	static left = () => {}
	static right = () => {}

}
