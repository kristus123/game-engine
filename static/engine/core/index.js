
const Pictures = {}
export const index = ''

function preload(x) {
	const promises = x.map(o => {
		return new Promise((resolve, reject) => {
			console.log(o)
			const img = new Image()
			console.log(img.complete)
			img.src = o.path
			img.onerror = reject
			if (img.complete) {
				Pictures[o.name] = img
				resolve()
			}

			img.onload = () => {
				Pictures[o.name] = img
				resolve()
		  // console.log(Pictures)
		  // console.log("resolved baby")
			}
		})
	})

	return Promise.all(promises)
}


// Usage
preload([
	{ name: 'test', path: '/static/assets/test.png' }
])
	.then(() => {





		ErrorHandler.run(() => {
			const mainPalette = Palette.main()
			const guiPalette = Palette.offscreen()
			const backgroundPalette = Palette.offscreen()
			// const showLogs = new ShowLogs(guiPalette)

			Mouse.initialize()

			const draw = new Draw(Cam.palette.ctx)
			const guiDraw = new Draw(guiPalette.ctx)

	 Level.change(new World())
	 // Level.change(new WorldEditor())

			//new VideoCall()

			Loop.everyFrame((deltaTime) => {
				ErrorHandler.run(() => {

					Palette.clear([Cam.palette, guiPalette])

					Physics.global.update(deltaTime)

					Cam.context(() => {

						Mouse.update()

						Controller.update()
						Controller.draw(draw, guiDraw)

						Level.update()
						Level.draw(draw, guiDraw)

						Mouse.draw(draw, guiDraw)

						if (MouseEditor.active) {
							MouseEditor.active.update()
							MouseEditor.active.draw(draw, guiDraw)
						}
					})

					// showLogs.draw()

					Palette.fill(backgroundPalette, '#6AB767')
					Palette.apply(mainPalette, [backgroundPalette, Cam.palette, guiPalette])
				})
			})
		})
	})
	.catch(err => {
		console.error('Image failed to load', err)
		throw err
	})
