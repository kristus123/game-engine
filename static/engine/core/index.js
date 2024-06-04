export const index = ''

ErrorHandler.run(() => {
	const mainPalette = Palette.main()
	const guiPalette = Palette.offscreen()
	const backgroundPalette = Palette.offscreen()
	const showLogs = new ShowLogs(guiPalette)

	const draw = new Draw(Camera.palette.ctx)
	const guiDraw = new Draw(guiPalette.ctx)

	const level = new Level()
	 level.change(new World(level))
	//level.change(new WorldEditor( ))

	const overlay = new Overlay()
	new VideoCall()
	Loop.everyFrame((deltaTime) => {
		ErrorHandler.run(() => {
			Palette.clear([Camera.palette, guiPalette])

			Physics.global.update(deltaTime)

			overlay.update()

			Camera.context(() => {
				Controller.update()
				Controller.draw(draw, guiDraw)

				level.update()
				level.draw(draw, guiDraw)
				overlay.draw(draw, guiDraw)
			})

			showLogs.draw()

			Palette.fill(backgroundPalette, '#130927')
			Palette.apply(mainPalette, [backgroundPalette, Camera.palette, guiPalette])
		})
	})
})
