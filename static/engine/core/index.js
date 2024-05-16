ErrorHandler.run(() => {
	const mainPalette = Palette.main()
	const guiPalette = Palette.offscreen()
	const backgroundPalette = Palette.offscreen()
	const showLogs = new ShowLogs(guiPalette)

	const camera = new Camera()
	const mouse = new Mouse(camera)
	camera.mouse = mouse

	const draw = new Draw(camera.palette.ctx)
	const guiDraw = new Draw(guiPalette.ctx)

	const controller = new Controller()

	const level = new Level()
	// level.change(new World(level, camera, mouse, controller))
	level.change(new WorldEditor(camera, mouse))
	
	const overlay = new Overlay(camera)

	Loop.everyFrame((deltaTime) => {
		ErrorHandler.run(() => {
			Palette.clear([camera.palette, guiPalette])

			Physics.global.update(deltaTime)

			overlay.update()

			camera.context(() => {
				controller.update()
				controller.draw(draw, guiDraw)

				level.update()
				level.draw(draw, guiDraw)
			})

			showLogs.draw()

			Palette.fill(backgroundPalette, '#130927')
			// new Draw.text(guiPalette.ctx, 20, 20, 80, 80, Loop.fps)
			Palette.apply(mainPalette, [backgroundPalette, camera.palette, guiPalette])
		})
	})
})
