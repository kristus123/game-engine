export const index = ''

ErrorHandler.run(() => {
	const mainPalette = Palette.main()
	const guiPalette = Palette.offscreen()
	const backgroundPalette = Palette.offscreen()
	const showLogs = new ShowLogs(guiPalette)
	const camera = new Camera()

	const draw = new Draw(camera.palette.ctx)
	const guiDraw = new Draw(guiPalette.ctx)

	const level = new Level()
	 level.change(new World(level,camera))
	//level.change(new WorldEditor(camera))

	const overlay = new Overlay(camera)
	new VideoCall()
	Loop.everyFrame((deltaTime) => {
		ErrorHandler.run(() => {
			Palette.clear([camera.palette, guiPalette])

			Physics.global.update(deltaTime)

			overlay.update()

			camera.context(() => {
				Controller.update()
				Controller.draw(draw, guiDraw)

				level.update()
				level.draw(draw, guiDraw)
				overlay.draw(draw, guiDraw)
			})

			showLogs.draw()

			Palette.fill(backgroundPalette, '#130927')
			Palette.apply(mainPalette, [backgroundPalette, camera.palette, guiPalette])
		})
	})
})
