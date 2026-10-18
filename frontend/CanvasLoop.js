export async function CanvasLoop(activeThing) {
	Palette.initialize()
	Mouse.initialize()
	Camera.initialize()
	Mouse.postCameraInitalize()

	return GameLoop.start(() => {
		Physics.update()
		Controller.update()
		Con.update()

		Camera.update()
		Mouse.update()

		Palette.render(() => {
			Shadow.updateOutsideCameraContext()
			activeThing.update()
			if activeThing.drawMouseMarker != false {
				D1.circle(Mouse.position)
			}
			for const c of SuperClass.all {
				c.showTags(D1)
			}
			Light.updateInsideCameraContext()
		})
	})
}
