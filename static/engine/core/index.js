export const index = ''

G.Pictures = {}

function preload(images) {
	const promises = images.map(o => {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.src = o.path
			img.onerror = reject
			if (img.complete) {
				G.Pictures[o.name] = img
				resolve()
			}
			else {
				img.onload = () => {
					G.Pictures[o.name] = img
					resolve()
				}
			}
		})
	})

	return Promise.all(promises)
}


// Usage
preload([
	{ name: 'test', path: '/static/assets/test.png' },
	{ name: 'farm', path: '/static/assets/farm_512x320.png' },
	{ name: 'chickenZone', path: '/static/assets/chicken_zone_farm_512x320.png' },
])
	.then(() => {
		ErrorHandler.run(() => {
			const mainPalette = Palette.main()
			const guiPalette = Palette.offscreen()
			const backgroundPalette = Palette.offscreen()
			// const showLogs = new ShowLogs(guiPalette)

			Mouse.initialize()
			Camera.initialize()
			Mouse.initializeAfterCameraIsInitialized()

			const draw = new Draw(Camera.palette.ctx)
			const guiDraw = new Draw(guiPalette.ctx)

			const rightClickMenu = new RightClickMenu()


	 Level.change(new World())
	 // Level.change(new WorldEditor())

			//new VideoCall()

			Loop.everyFrame((deltaTime) => {
				ErrorHandler.run(() => {

					Palette.clear([Camera.palette, guiPalette])

					Physics.global.update(deltaTime)

					Camera.context(() => {

						Mouse.update()

						Controller.update()
						Controller.draw(draw, guiDraw)

						Level.update()
						Level.draw(draw, guiDraw)

						rightClickMenu.update()
						rightClickMenu.draw(draw, guiDraw)

						Text.updateAll()

						Mouse.draw(draw, guiDraw)

						if (MouseEditor.active) {
							MouseEditor.active.update()
							MouseEditor.active.draw(draw, guiDraw)
						}
					})

					// showLogs.draw()

					Palette.fill(backgroundPalette, '#6AB767')
					Palette.apply(mainPalette, [backgroundPalette, Camera.palette, guiPalette])
				})
			})
		})
	})
	.catch(err => {
		console.error('Image failed to load', err)
		throw err
	})
