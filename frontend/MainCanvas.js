export class MainCanvas {

	static canvas = null

	static init(activeThing) {
		if this.canvas {
			throw new Error("can only init MainCanvas once")
		}

		Palette.initialize()
		this.canvas = Palette.main.canvas
		Mouse.initialize()
		Camera.initialize()
		Mouse.postCameraInitalize()

		return GameLoop.start(() => {
			Controller.update()
			GamepadController.update()
			Physics.update()

			Camera.update()
			Mouse.update()

			Palette.render(() => {
				Shadow.updateOutsideCameraContext()
				activeThing.update()
				D1.circle(Mouse.position)
				for const c of SuperClass.all {
					c.showTags(D1)
				}
				Light.updateInsideCameraContext()
			})
		})
	}

	static add() {
		if !this.canvas {
			throw new Error("MainCanvas.init() must be called before MainCanvas.add()")
		}

		this.canvas.setAttribute("overlay-fixed", "")
		document.body.appendChild(this.canvas)
		return this.canvas
	}

}
