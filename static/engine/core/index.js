export const index = 'this is needed or else shit will crash'

try {
	const mainPalette = Palette.main()
	const guiPalette = Palette.offscreen()
	const backgroundPalette = Palette.offscreen()
	const starBackground = new StarBackground()
	const showLogs = new ShowLogs(guiPalette)

	const camera = new Camera()
	const mouse = new Mouse(camera)

	let objectToFollow = { x: 0, y: 0 }
	const cameraFollow = (f) => (objectToFollow = f)

	const level = new MainLevel(cameraFollow, mouse)

	Loop.everyFrame((deltaTime) => {
		Palette.clear([camera.palette, guiPalette])

		Physics.global.update(deltaTime)

		camera.context(() => {
			camera.follow(objectToFollow) // Keep this after physics.update and within camera.context
			level.update()
			level.draw(camera.palette.ctx)
		})

		starBackground.draw(objectToFollow)
		showLogs.

		Palette.fill(backgroundPalette, 'black')
		Draw.text(guiPalette.ctx, 20, 20, 80, 80, Loop.fps)
		Palette.apply(mainPalette, [backgroundPalette, starBackground.palette, camera.palette, guiPalette])
	})
}
catch(error) {
	const errorOverlay = document.getElementById('errorOverlay')
	const errorMessage = document.getElementById('errorMessage')

	const stackMessage = error.stack
		.replaceAll(/\n/g, '<br>')
		.replaceAll('http://localhost:5000', '')
		.replaceAll('http://localhost:5000', '')
		.replaceAll('at ', '')

	errorMessage.innerHTML = `Error: ${error.message}
		<br><br>
		<br>
		${stackMessage}
	`
	// errorMessage.textContent = `Error: ${error.message}`;
	errorOverlay.style.display = 'flex'
}
