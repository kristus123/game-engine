
export const index = 'this is needed or else shit will crash'

ErrorHandler.run(() => {
	const mainPalette = Palette.main()
	const guiPalette = Palette.offscreen()
	const backgroundPalette = Palette.offscreen()
	const showLogs = new ShowLogs(guiPalette)

	const camera = new Camera()
	const mouse = new Mouse(camera)
	camera.mouse = mouse

	const levelSelector = new LevelSelector()
	// levelSelector.changeActiveLevel(new MainLevel(levelSelector, camera, mouse))
	levelSelector.changeActiveLevel(new MainLevel(levelSelector, camera, mouse))

	Loop.everyFrame((deltaTime) => {
		ErrorHandler.run(() => {
			Palette.clear([camera.palette, guiPalette])

			Physics.global.update(deltaTime)

			camera.context(() => {
				levelSelector.update()
				levelSelector.draw(new Draw(camera.palette.ctx), new Draw(guiPalette.ctx))
			})

			showLogs.draw()

			Palette.fill(backgroundPalette, '#130927')
			// new Draw.text(guiPalette.ctx, 20, 20, 80, 80, Loop.fps)
			Palette.apply(mainPalette, [backgroundPalette, camera.palette, guiPalette])
		})
	})
})
