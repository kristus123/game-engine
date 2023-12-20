export const index = 'this is needed or else shit will crash'

ErrorHandler.run(() => {
	const mainPalette = Palette.main()
	const guiPalette = Palette.offscreen()
	const backgroundPalette = Palette.offscreen()
	const starBackground = new StarBackground()
	const showLogs = new ShowLogs(guiPalette)

	const camera = new Camera()
	const mouse = new Mouse(camera)
	camera.mouse = mouse

	const level = new MainLevel(camera, mouse)

	Loop.everyFrame((deltaTime) => {
		ErrorHandler.run(() => {
			Palette.clear([camera.palette, guiPalette])

			Physics.global.update(deltaTime)

			camera.context(() => {
				level.update()
				level.draw(camera.palette.ctx, guiPalette.ctx)
			})

			starBackground.draw(camera.objectToFollow)
			showLogs.draw()

			Palette.fill(backgroundPalette, 'black')
			Draw.text(guiPalette.ctx, 20, 20, 80, 80, Loop.fps)
			Palette.apply(mainPalette, [backgroundPalette, starBackground.palette, camera.palette, guiPalette])
		})
	})
})
