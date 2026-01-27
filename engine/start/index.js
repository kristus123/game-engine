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
	console.log(path)

	const fileName = path.split('/').pop()

	return Promise.all([
		LoadImage(`${path}Layers.png`),
		LoadJson(`${path}Layers.json`),
		LoadImage(`${path}.png`),
		LoadJson(`${path}.json`),
		LoadJsonIfPresent(`${path}Tilemaps.json`),
	]).then(([layersImage,
		layersJson,
		fullImage,
		fullJson,
		tilemapsJson]) => {
		Sprite[fileName] = (pos, scale=1) => new SpriteController(
			pos,
			fullImage,
			new AsepriteJson(fullJson),
			new SpriteLayers(pos, layersImage, new AsepriteLayerJson(layersJson), scale),
			tilemapsJson
				? new TileSheet(new AsepriteTilesJson(tilemapsJson), fullImage, scale)
				: false
			,
			scale,
		)
	})
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

		const draw = Draw(Camera.palette.ctx)

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
	.catch(e => {
		console.error(e)

		const err = e instanceof Error ? e : new Error(e)
		const lines = (err.stack || '').split('\n')

		Dom.swap(
			lines.map(line => Html.p(line))
		)

		throw err
	})
