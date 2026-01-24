

export const index = ''
import { initD1 } from '/engine/start/D1.js'

navigator.serviceWorker.getRegistrations().then(r => r.forEach(sw => sw.unregister()))
if ('serviceWorker' in navigator) {
	// navigator.serviceWorker.register('/sw.js') // add this back when our sw is ready
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
			LoadJson(`${path}.json`),
		]).then(([img, json]) => {
			G.image[fileName] = img
			Sprite[fileName] = (pos, scale) => new SpriteController(pos, img, new AsepriteJson(json), scale)
		})

		return Promise.all([p1, p2])
	}
	else if (path.includes('_tilemaps.json')) {
		const x = path.split('/').pop().replace('_tilemaps.json', '')
		console.log(path)
		return LoadJson(path).then(json => {
			if (json) {
				G.TileSheet[x] = new TileSheet(new AsepriteTilesJson(json), G.image[x])
			}
		})
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

Promise.all([
	Promise.all(ASEPRITE_FILES.map(loadAsepriteAssets)),
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

		initD1(draw)

		Level.change(new World())

		Loop.everyFrame(deltaTime => {
			Camera.palette.clear()

			Physics.update(deltaTime)

			Camera.context(() => {

				Controller.update()

				Level.update()
				Level.draw(draw) // deprecated

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
