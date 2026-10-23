export async function CanvasLoop(activeThing, canvasParent = document.body) {
	Palette.initialize(canvasParent)
	Mouse.initialize()
	Camera.initialize()
	Mouse.postCameraInitalize()

	return GameLoop.start(() => {
		Physics.update()
		Controller.update()
		GamepadController.update()

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
