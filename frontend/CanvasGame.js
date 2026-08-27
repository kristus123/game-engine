import { initD1 } from "#root/tools/game/start/draw_layers/D1.js"
import { initD2 } from "#root/tools/game/start/draw_layers/D2.js"
import { initD3 } from "#root/tools/game/start/draw_layers/D3.js"

export function CanvasGame(activeThing) {

	Promise.all([
		Promise.all(AssetPaths.aseprite.map(LoadAsepriteAssets)),
		LoadAllAudio(AssetPaths.audio),
		LoadAllImages(AssetPaths.image),
		// LoadPersistedJson(),
	])
		.then((x) => {

			Mouse.initialize()
			Camera.initialize()
			Mouse.initializeAfterCameraIsInitialized()

			initD1(Draw(Palette.d1.ctx))
			initD2(Draw(Palette.d2.ctx))
			initD3(Draw(Palette.d3.ctx))

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
}
