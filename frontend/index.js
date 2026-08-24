export const index = ""

import { initD1 } from "/tools/game/start/draw_layers/D1.js"
import { initD2 } from "/tools/game/start/draw_layers/D2.js"
import { initD3 } from "/tools/game/start/draw_layers/D3.js"

SocketClient.connect(() => {
	console.log("connected")
	Log("Session started - Client connected!")
})

SocketClient.onServerMessage("HOT_RELOAD", () => {
	Dom.overlay(H.p("RELOADING").css("color:white; font-size:150px;"))
	location.reload()
})

ServiceWorker.init()
HtmlObserverThing((node) => {

	//make it better later! currently only work with contenteditable
	if node.hasAttribute("prevent-default") {  
		node.addEventListener("keydown", (e) => {
			if (e.key == "Enter") {
	 		   e.preventDefault();
	 		}
		});
	}
})

Gp.init()
// DeviceListener.init()

// await ClientToken.init()

Promise.all([
	Promise.all(AssetPaths.aseprite.map(LoadAsepriteAssets)),
	Promise.all(AssetPaths.htmlTemplate.map(LoadHtmlContent)),
	LoadAllAudio(AssetPaths.audio),
	LoadAllImages(AssetPaths.image),
	Promise.all(AssetPaths.htmlComponent.map(c => {
		WebComponent(c.name, c.content)
	}))
	// LoadPersistedJson(),
])
	.then((x) => {

		Mouse.initialize()
		Camera.initialize()
		Mouse.initializeAfterCameraIsInitialized()

		initD1(Draw(Palette.d1.ctx))
		initD2(Draw(Palette.d2.ctx))
		initD3(Draw(Palette.d3.ctx))

		const activeThing = CodeEditor()

		GameLoop.start(() => {
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
	})
	.catch(e => {
		const lines = (e.stack || "").split("\n")

		Dom.swapBody(lines.map(x => H.p(x)))

		throw e
	})
