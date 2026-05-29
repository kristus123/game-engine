export const index = ""

import { initD1 } from "/client/engine/start/draw_layers/D1.js"
import { initD2 } from "/client/engine/start/draw_layers/D2.js"
import { initD3 } from "/client/engine/start/draw_layers/D3.js"

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
	LoadPersistedJson(),
])
	.then((x) => {

		Sound.init()
		Mouse.initialize()
		Camera.initialize()
		Mouse.initializeAfterCameraIsInitialized()

		initD1(Draw(Palette.d1.ctx))
		initD2(Draw(Palette.d2.ctx))
		initD3(Draw(Palette.d3.ctx))

		const worldModule = x[0]
		const world = new worldModule()

		Loop.everyFrame(() => {
			Palette.main.fill("#10204f")

			Palette.d1.clear()
			Palette.d2.clear()
			Palette.d3.clear()

			Palette.light.clear()

			Physics.update()
			Controller.update()
			GamePad.update()

			Shadow.updateOutsideCameraContext()
			Camera.applyPositionContextThing([
				Palette.d1.ctx,
				Palette.d2.ctx,
				Palette.d3.ctx,
				Palette.light.ctx,
			], () => {
				world.update()
				Mouse.update()
				for (const c of SuperClass.all) {
					c.showTags()
				}
				Light.updateInsideCameraContext()
			})

			Palette.main.apply(Palette.d3)
			Palette.main.apply(Palette.d2)
			Palette.main.apply(Palette.d1)
			Palette.main.apply(Palette.light)
		})
	})
	.catch(e => {
		const lines = (e.stack || "").split("\n")

		Dom.swapBody(lines.map(x => H.p(x)))

		throw e
	})
