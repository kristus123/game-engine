export const index = ''

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js')
}

document.body.addEventListener('touchmove', e => {
	while (e.target && e.target !== document.body) {
		if (e.target.classList && e.target.classList.contains('scroll')) {
			// allow scroll
		}
		else {
			e.target = e.target.parentNode
		}
	}

	e.preventDefault()
}, { passive: false })


HotReload()

Enhance_js_Array()
Enhance_html()

function loadAsepriteAssets(path) {

	const fileName = path.split('/').pop()

	if (!path.includes('_tilemaps.json')) {

		const p1 = Promise.all([
			LoadImage(`${path}Layers.png`),
			LoadJson(`${path}Layers.json`),
		]).then(([img, json]) => {
			G.SpriteLayers[fileName] = pos => new SpriteLayers(pos, img, new AsepriteLayerJson(json))
		})

		const p2 = Promise.all([
			LoadImage(`${path}.png`),
			console.log(path),
			LoadJson(`${path}.json`),
		]).then(([img, json]) => {
			G.image[fileName] = img
			G.Sprite[fileName] = pos => new Sprite(pos, img, new AsepriteJson(json))
		})

		return Promise.all([p1, p2])
	}
}

function loadAllAudio() {
	return Promise.all(AUDIO_FILES.map(a =>
		LoadAudio(a).then(audio => {
			const key = a.split('/').pop().replace('.mp3', '')
			G.Audio[key] = audio
		})
	))
}

function loadAsepriteTilemaps(path) {

	const fileName = path.split('/').pop().replace('_tilemaps.json', '')

	if (path.includes('_tilemaps.json')) {
		console.log("Before Replace: "+path.toString())
		path = path.replace('/game/assets/', '/game/assets/aseprite/')
		console.log("After Replace: "+path.toString())
		return LoadJson(path).then(json => {
			if (json) {
				G.TileSheet[fileName] = new TileSheet(new AsepriteTilesJson(json), G.image[fileName])
			}
		})
	}
}

Promise.all([
	Promise.all(ASEPRITE_FILES.map(loadAsepriteAssets)).then(() => Promise.all(ASEPRITE_FILES.map(loadAsepriteTilemaps))),
	loadAllAudio(),
])
	.then(() => {
		const mainPalette = Palette.main()
		const backgroundPalette = Palette.offscreen()

		Sound.init()
		Mouse.initialize()
		Controller.init()
		Camera.initialize()
		Mouse.initializeAfterCameraIsInitialized()

		const draw = new Draw(Camera.palette.ctx)
		D1.ctx = Camera.palette.ctx

		Level.change(new World())

		Loop.everyFrame(deltaTime => {
			Camera.palette.clear()

			Physics.update(deltaTime)

			Camera.context(() => {

				Controller.update()

				Level.update()
				Level.draw(draw)

				Mouse.update()
			})

			backgroundPalette.fill('#10204f')

			mainPalette.apply(backgroundPalette)
			mainPalette.apply(Camera.palette)
		})
	})
	.catch(err => {
		console.error('Image failed to load', err)
		throw err
	})
