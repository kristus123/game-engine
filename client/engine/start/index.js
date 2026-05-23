export const index = ""

import { initD1 } from "/client/engine/start/draw_layers/D1.js"
// import { initD2 } from "/client/engine/start/draw_layers/D2.js"
// import { initD3 } from "/client/engine/start/draw_layers/D3.js"

async function loadWorld() {
	const module = await import("/client/game/code/World.js")
	const World = module.World
	return World // for some reason it crashes if you don't do it like this
}

ServiceWorker.init()
// HtmlObserverThing()

Promise.all([
	loadWorld(),
	Promise.all(ASEPRITE_FILES.map(LoadAsepriteAssets)),
	Promise.all(HTML_CONTENTS.map(LoadHtmlContent)),
	LoadAllAudio(AUDIO_FILES),
])
	.then((x) => {

		Sound.init()
		Mouse.initialize()
		Camera.initialize()
		Mouse.initializeAfterCameraIsInitialized()

		initD1(Draw(Palette.main.ctx))

		const worldModule = x[0]
		const world = new worldModule()

		Loop.everyFrame(() => {
			Palette.main.fill("#10204f")

			Physics.update()
			Controller.update()
			GamePad.update()

			Camera.applyPositionContextThing(Palette.main.ctx, () => {
				world.update()
				Mouse.update()
				for (const c of SuperClass.all) {
					c.showTags()
				}
			})

			Palette.light.clear()
			LightSource.update()
			Camera.applyPositionContextThing(Palette.light.ctx, () => {
				LightSource.drawLight(1500, 2200)
			})

			Palette.main.apply(Palette.light)
		})
	})
	.catch(e => {
		const lines = (e.stack || "").split("\n")

		Dom.swap(lines.map(x => Html.p(x)))

		throw e
	})
