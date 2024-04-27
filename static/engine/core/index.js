export const index = 'this is needed or else shit will crash'

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

	const levelSelector = new LevelSelector()
	// const level = new MainLevel(levelSelector, new World(levelSelector, camera, mouse), camera, mouse)
	const level = new World(levelSelector, camera, mouse)
	levelSelector.changeActiveLevel(level)

	// Overlay.create(level.world.player)

	// levelSelector.changeActiveLevel(new CinematicIntroLevel(levelSelector, camera, mouse))
	// levelSelector.changeActiveLevel(new DatingSimLevel(levelSelector, camera, mouse))
	// levelSelector.changeActiveLevel(new WorldEditor(camera, mouse))

	Loop.everyFrame((deltaTime) => {
		ErrorHandler.run(() => {
			Palette.clear([camera.palette, guiPalette])

			Physics.global.update(deltaTime)

			camera.context(() => {
				levelSelector.update()
				levelSelector.draw(draw, guiDraw)
			})

			// Overlay.follow(level.world.player)

			showLogs.draw()

			Palette.fill(backgroundPalette, '#130927')
			// new Draw.text(guiPalette.ctx, 20, 20, 80, 80, Loop.fps)
			Palette.apply(mainPalette, [backgroundPalette, camera.palette, guiPalette])
		})
	})
})
