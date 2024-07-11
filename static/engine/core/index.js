export const index = ''

ErrorHandler.run(() => {
	const mainPalette = Palette.main()
	const guiPalette = Palette.offscreen()
	const backgroundPalette = Palette.offscreen()
	const showLogs = new ShowLogs(guiPalette)

	Mouse.initialize(Cam)

	const draw = new Draw(Cam.palette.ctx)
	const guiDraw = new Draw(guiPalette.ctx)

	 // Level.change(new World())
	 Level.change(new WorldEditor())

	//new VideoCall()

	Loop.everyFrame((deltaTime) => {
		ErrorHandler.run(() => {
			Palette.clear([Cam.palette, guiPalette])

			Physics.global.update(deltaTime)

			Cam.context(() => {
				Controller.update()
				Controller.draw(draw, guiDraw)

				Level.update()
				Level.draw(draw, guiDraw)

				if (MouseEditor.active) {
					MouseEditor.active.update()
					MouseEditor.active.draw(draw, guiDraw)
				}
			})

			showLogs.draw()

			Palette.fill(backgroundPalette, '#2AB1C6')
			Palette.apply(mainPalette, [backgroundPalette, Cam.palette, guiPalette])
		})
	})
})
