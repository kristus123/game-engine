export const index = ''
import { initD1 } from '/engine/start/D1.js'
import { initD2 } from '/engine/start/D2.js'
import { initD3 } from '/engine/start/D3.js'

navigator.serviceWorker.getRegistrations().then(r => r.forEach(sw => sw.unregister()))
if ('serviceWorker' in navigator) {
	// navigator.serviceWorker.register('/sw.js') // add this back when our sw is ready
}

document.body.addEventListener('touchmove', e => {
	while (e.target && e.target !== document.body) {
		if (e.target.classList && e.target.classList.contains('scroll')) {
			// allow scrollsp
		}
		else {
			e.target = e.target.parentNode
		}
	}

	e.preventDefault()
}, { passive: false })



function loadAsepriteAssets(path) {
	const fileName = path.split('/').pop()

	return Promise.all([
		LoadImage(`${path}.png`),
		LoadJson(`${path}.json`),
		LoadImage(`${path}Layers.png`),
		LoadJson(`${path}Layers.json`),
		LoadJsonIfPresent(`${path}Tilemaps.json`),
	]).then(([
		fullImage,
		fullJson,
		layersImage,
		layersJson,
		tilemapsJson,
	]) => {
		Sprite[fileName] = (d, position, scale=1) => new SpriteController(
			d,
			position,
			fullImage,
			fullJson,
			layersImage,
			layersJson,
			tilemapsJson,
			scale)
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

		Audio.init()
		Mouse.initialize()
		Controller.init()
		Camera.initialize()
		Mouse.initializeAfterCameraIsInitialized()

		initD1(Camera.palettes.d1.draw)
		initD2(Camera.palettes.d2.draw)
		initD3(Camera.palettes.d3.draw)

		Level.change(new World())

		Loop.everyFrame(() => {
			Camera.palettes.forEach((d, palette) => {
				palette.clear()
			})

			Physics.update()

			Camera.context(() => {

				Controller.update()

				Level.update()

				Mouse.update()
			})

			backgroundPalette.fill('#10204f')

			mainPalette.apply(backgroundPalette)
			mainPalette.apply(Camera.palettes.d3)
			mainPalette.apply(Camera.palettes.d2)
			mainPalette.apply(Camera.palettes.d1)
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
