export const index = ''

const loadAsepriteAssets = (path) => {
	if (path.includes('_tilemaps.json')) {
		console.log(path)
		return LoadJson(`${path}`).then(json => {
			console.log(json)
			if (json) {
				console.log(json)
			}
		})
	}
	else {
		const fileName = path.split('/').pop()

		const p1 = LoadImage(`${path}Layers.png`).then(img => {
			const asepriteLayerJson = new AsepriteLayerJson(StaticHttp.get(`${path}Layers.json`))
			G.SpriteLayers[fileName] = pos => new SpriteLayers(pos, img, asepriteLayerJson)
		})

		const p2 = LoadImage(`${path}.png`).then(img => LoadJson(`${path}.json`).then(json => {
			G.image[fileName] = img
			G.Sprite[fileName] = pos => new Sprite(pos, img, new AsepriteJson(json))
		}))
		return Promise.all([p1, p2])
	}
}

const loadAllAudio = () => {
	const audioFiles = ['/static/audio/sheet.mp3', '/static/audio/click.mp3']
	return Promise.all(audioFiles.map(a =>
		LoadAudio(a).then(audio => {
			const key = a.split('/').pop().replace('.mp3', '')
			G.Audio[key] = audio
		})
	))
}

Promise.all([
	Promise.all(ASEPRITE_FILES.map(loadAsepriteAssets)),
	loadAllAudio(),
]).then(() => {
	const mainPalette = Palette.main()
	const guiPalette = Palette.offscreen()
	const backgroundPalette = Palette.offscreen()
	// const showLogs = new ShowLogs(guiPalette)

	Sound.init()
	Mouse.initialize()
	Camera.initialize()
	Mouse.initializeAfterCameraIsInitialized()

	const draw = new Draw(Camera.palette.ctx)
	const guiDraw = new Draw(guiPalette.ctx)

	Level.change(new World())

	//new VideoCall()

	Loop.everyFrame(deltaTime => {
		ErrorHandler.run(() => {

			Camera.palette.clear()
			guiPalette.clear()

			Physics.update(deltaTime)

			Camera.context(() => {

				Controller.update()
				Controller.draw(draw, guiDraw)

				Level.update()
				Level.draw(draw, guiDraw)

				Mouse.update()
				Mouse.draw(draw, guiDraw)
			})

			// showLogs.draw()

			backgroundPalette.fill('#10204f')

			mainPalette.apply(backgroundPalette)
			mainPalette.apply(Camera.palette)
			mainPalette.apply(guiPalette)
		})
	})
})
	.catch(err => {
		console.error('Image failed to load', err)
		throw err
	})
