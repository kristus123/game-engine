export const index = ""

import { initD1 } from "/client/engine/start/draw_layers/D1.js"
import { initD2 } from "/client/engine/start/draw_layers/D2.js"
import { initD3 } from "/client/engine/start/draw_layers/D3.js"

ServiceWorker.init()
// HtmlObserverThing()

Gp.init()

EnhanceAll()

Promise.all([
	Promise.all(ASEPRITE_FILES.map(LoadAsepriteAssets)),
	Promise.all(HTML_CONTENTS.map(LoadHtmlContent)),
	LoadAllAudio(AUDIO_FILES),
	// LoadPersistedJson(),
])
	.then((x) => {

		Sound.init()
		Mouse.initialize()
		Camera.initialize()
		Mouse.initializeAfterCameraIsInitialized()

		initD1(Draw(Palette.d1.ctx))
		initD2(Draw(Palette.d2.ctx))
		initD3(Draw(Palette.d3.ctx))

		const activeThing = SfuWorld()

		Loop.everyFrame(() => {
			Palette.main.fill("#10204f")

			Palette.d1.clear()
			Palette.d2.clear()
			Palette.d3.clear()

			Palette.light.clear()

			Physics.update()
			Controller.update()
			Gp.update()

			Shadow.updateOutsideCameraContext()
			Camera.applyPositionContextThing([
				Palette.d1.ctx,
				Palette.d2.ctx,
				Palette.d3.ctx,
				Palette.light.ctx,
			], () => {
				Camera.update()
				activeThing.update()
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
		MicSpeakerLogTest.run() // remove after speaker testing
	})
	.catch(e => {
		const lines = (e.stack || "").split("\n")

		Dom.swapBody(lines.map(x => H.p(x)))

		throw e
	})
