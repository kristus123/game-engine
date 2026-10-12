export async function CanvasLoop(activeThing) {

	try {
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
				D1.circle(Mouse.position)
				for (const c of SuperClass.all) {
					c.showTags(D1)
				}
				Light.updateInsideCameraContext()
			})
		})
	}
	catch (e) {
		const lines = (e.stack || "").split("\n")

		Dom.swapBody(lines.map(x => H.p(x)))

		throw e
	}
}
