export const index = ''

function loadImage(pngPath) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = pngPath;
    img.onerror = reject;

    if (img.complete) {
      resolve(img);
    } else {
      img.onload = () => resolve(img);
    }
  });
}

G.pictures = {}

Promise.all(ASEPRITE_FILES.map(path => {
	const fileName = path.split("/").pop()
	const pngPath = path + ".png"
	const json = Http.get(path + ".json")

	return loadImage(pngPath).then(img => G.pictures[fileName] = new AsepritePicture(img, json))
}))
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
