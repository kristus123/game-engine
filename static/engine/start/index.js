export const index = ''


function loadAsepriteAssets(path) {

	const fileName = path.split('/').pop()

	if (!path.includes('_tilemaps.json')) {
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

function loadAllAudio() {
	const files = [
		'/static/audio/sheet.mp3',
		'/static/audio/click.mp3',
		'/static/audio/nyaSheet.mp3',
	]

	return Promise.all(files.map(a =>
		LoadAudio(a).then(audio => {
			const key = a.split('/').pop().replace('.mp3', '')
			G.Audio[key] = audio
		})
	))
}

function loadAsepriteTilemaps(path) {

	const fileName = path.split('/').pop().replace("_tilemaps.json", "")

	if (path.includes('_tilemaps.json')) {
		path = path.replace("/static/assets/", "/static/assets/aseprite/")

		return LoadJson(path).then(json => {
			if (json) {
				G.TileSheet[fileName] = new TileSheet(new AsepriteTilesJson(json), G.image[fileName])
			}
		})
	}
}


Promise.all([
	Promise.all(ASEPRITE_FILES.map(loadAsepriteAssets)),
	loadAllAudio(),
])
.then(() => Promise.all([
	Promise.all(ASEPRITE_FILES.map(loadAsepriteTilemaps)),
]))
.then(() => {
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
