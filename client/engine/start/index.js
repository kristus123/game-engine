export const index = ""

import { initD1 } from "/client/engine/start/draw_layers/D1.js"
// import { initD2 } from "/client/engine/start/draw_layers/D2.js"
// import { initD3 } from "/client/engine/start/draw_layers/D3.js"

async function loadWorld() {
	const module = await import("/client/game/code/World.js")
	const World = module.World
	return World // for some reason it crashes if you don't do it like this
}

export function drawLight(ctx, x, y, radius=1500) {
	ctx.save()

	ctx.globalCompositeOperation = "destination-out"

	const g = ctx.createRadialGradient(x, y, 0, x, y, radius)
	g.addColorStop(0, "rgba(255,255,255,1)")
	g.addColorStop(1, "rgba(255,255,255,0)")

	ctx.fillStyle = g
	ctx.beginPath()
	ctx.arc(x, y, radius, 0, Math.PI * 2)
	ctx.fill()

	ctx.restore()
}

export function drawLightColor(ctx, x, y, radius, color = "255,255,255", intensity = 1) {
	ctx.save()

	ctx.globalCompositeOperation = "screen"
	// ctx.globalCompositeOperation = "lighter"

	const g = ctx.createRadialGradient(x, y, 0, x, y, radius)

	g.addColorStop(0, `rgba(${color},${intensity})`)
	g.addColorStop(1, `rgba(${color},0)`)

	ctx.fillStyle = g
	ctx.beginPath()
	ctx.arc(x, y, radius, 0, Math.PI * 2)
	ctx.fill()

	ctx.restore()
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
			Palette.light.clear()

			Physics.update()
			Controller.update()
			GamePad.update()

			Camera.applyPositionContextThing(Palette.main, () => {
				world.update()
				Mouse.update()
				for (const c of SuperClass.all) {
					c.showTags()
				}
			})

			// Palette.light.fill("black", 1)
			Camera.applyPositionContextThing(Palette.light, () => {
				// drawLight(Palette.light.ctx, 2000, 2000)
				// drawLight(Palette.light.ctx, 1500, 2200)
				// drawLightColor(Palette.light.ctx, 2000, 2000, 700, "200,0,100", 0.5)
				// drawLightColor(Palette.light.ctx, 2000, 2000, 700, "200,0,20", 0.5)
			})

			Palette.main.apply(Palette.light)
		})
	})
	.catch(e => {
		const lines = (e.stack || "").split("\n")

		Dom.swap(lines.map(x => Html.p(x)))

		throw e
	})
