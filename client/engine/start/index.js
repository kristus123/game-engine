export const index = ""
import { initD1 } from "/client/engine/start/draw_layers/D1.js"
import { initD2 } from "/client/engine/start/draw_layers/D2.js"
import { initD3 } from "/client/engine/start/draw_layers/D3.js"

navigator.serviceWorker.getRegistrations().then(r => r.forEach(sw => sw.unregister()))
if ("serviceWorker" in navigator) {
	// navigator.serviceWorker.register('/sw.js') // add this back when our sw is ready
}

async function loadAsepriteAssets(path) {

	const fullImage = await LoadImage(`${path}.png`)
	const fullJson = await LoadJson(`${path}.json`)

	const layersImage = await LoadImage(`${path}Layers.png`)
	const layersJson = await LoadJson(`${path}Layers.json`)

	const tilemapsJson = await LoadJsonIfPresent(`${path}Tilemaps.json`)

	const spriteName = path.split("/").pop()
	Sprite[spriteName] = (d, position, scale=1) => new SpriteController(
		d, position,
		fullImage, fullJson,
		layersImage, layersJson,
		tilemapsJson,
		scale)
}

async function loadAllAudio() {
	return Promise.all(AUDIO_FILES.map(async path => {
		const audio = await LoadAudio(path)
		const key = path.split("/").pop().replace(".mp3", "")
		G.Audio[key] = audio
	}))
}

Promise.all([
	Promise.all(ASEPRITE_FILES.map(loadAsepriteAssets)),
	loadAllAudio(),
])
	.then(() => {
		const mainPalette = Palette.main()
		const backgroundPalette = Palette.offscreen()
		backgroundPalette.fill("#10204f")

		const filterPalette = Palette.offscreen()
		filterPalette.fill("#03045e", 0.2)

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

			mainPalette.apply(backgroundPalette)
			mainPalette.apply(Camera.palettes.d3)
			mainPalette.apply(Camera.palettes.d2)
			mainPalette.apply(filterPalette)
			mainPalette.apply(Camera.palettes.d1)
		})
	})
	.catch(e => {
		console.error(e)

		const err = e instanceof Error ? e : new Error(e)
		const lines = (err.stack || "").split("\n")

		Dom.swap(lines.map(line => Html.p(line)))

		throw err
	})
