export const index = ""

import { initD1 } from "/client/engine/start/draw_layers/D1.js"
// import { initD2 } from "/client/engine/start/draw_layers/D2.js"
// import { initD3 } from "/client/engine/start/draw_layers/D3.js"

async function loadWorld() {
	const module = await import("/client/game/code/World.js")
	const World = module.World
	return World // for some reason it crashes if you don't put it in a variable
}

ServiceWorker.init()
HtmlObserverThing()

Promise.all([
	loadWorld(),
	Promise.all(ASEPRITE_FILES.map(LoadAsepriteAssets)),
	Promise.all(HTML_CONTENTS.map(LoadHtmlContent)),
	LoadAllAudio(AUDIO_FILES),
])
	.then((x) => {

		const mainPalette = Palette.main()

		Sound.init()
		Mouse.initialize()
		Controller.init()
		Camera.initialize()
		Mouse.initializeAfterCameraIsInitialized()

		initD1(Draw(mainPalette.ctx))

		const world = x[0]
		Level.change(new world())

		Loop.everyFrame(() => {
			// mainPalette.clear()
			mainPalette.fill("#10204f")

			Camera.applyPositionContextThing(mainPalette, () => {
				Physics.update()
				Controller.update()
				Level.update()
				Mouse.update()
			})

		})
	})
	.catch(e => {
		console.error(e)

		const err = e instanceof Error ? e : new Error(e)
		const lines = (err.stack || "").split("\n")

		Dom.swap(lines.map(x => Html.p(x)))

		throw err
	})
