import { AsepriteJson } from '/static/engine/AsepriteJson.js'; 
import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Call } from '/static/engine/code_tools/tools/Call.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { MouseEditor } from '/static/engine/controller/mouse/MouseEditor.js'; 
import { Draw } from '/static/engine/core/Draw.js'; 
import { Level } from '/static/engine/core/Level.js'; 
import { Loop } from '/static/engine/core/Loop.js'; 
import { Palette } from '/static/engine/core/Palette.js'; 
import { RightClickMenu } from '/static/engine/core/RightClickMenu.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { ErrorHandler } from '/static/engine/core/logging/ErrorHandler.js'; 
import { ShowLogs } from '/static/engine/core/logging/ShowLogs.js'; 
import { Physics } from '/static/engine/core/physics/Physics.js'; 
import { WorldEditor } from '/static/engine/editor/WorldEditor.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Http } from '/static/engine/http/Http.js'; 
import { StaticHttp } from '/static/engine/http/StaticHttp.js'; 
import { Text } from '/static/engine/mechanics/dialogue/Text.js'; 
import { VideoCall } from '/static/engine/socket/VideoCall.js'; 
import { D } from '/static/game/world/D.js'; 
import { World } from '/static/game/world/World.js'; 

export const index = ''


// window.onload = () => { // not working todo fix
// 	document.body.style.transform = "scale(1)";
// 	document.body.style.zoom = "100%";
// 	document.body.style.transformOrigin = "0 0";
// }


function loadImage(pngPath) {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.src = pngPath
		img.onerror = reject

		if (img.complete) {
			resolve(img)
		}
		else {
			img.onload = () => resolve(img)
		}
	})
}

const whenLoaded = Promise.all(["/static/assets/flower","/static/assets/grass","/static/assets/player/player","/static/assets/player/viking","/static/assets/world"].map(path => {
	const fileName = path.split('/').pop()
	const pngPath = path + '.png'
	const asepriteJson = new AsepriteJson(StaticHttp.get(path + '.json'))

	return loadImage(pngPath)
		.then(img => G.Sprite[fileName] = (pos) => new Sprite(pos, img, asepriteJson))
}))


whenLoaded.then(() => {
	ErrorHandler.run(() => {
		const mainPalette = Palette.main()
		const guiPalette = Palette.offscreen()
		const backgroundPalette = Palette.offscreen()
		// const showLogs = new ShowLogs(guiPalette)

		Mouse.initialize()
		Camera.initialize()
		Mouse.initializeAfterCameraIsInitialized()

		const draw = new Draw(Camera.palette.ctx)
		const guiDraw = new Draw(guiPalette.ctx)

		const rightClickMenu = new RightClickMenu()


		Level.change(new World())
		// Level.change(new WorldEditor())

		//new VideoCall()

		Loop.everyFrame((deltaTime) => {
			ErrorHandler.run(() => {

				Palette.clear([Camera.palette, guiPalette])

				Physics.global.update(deltaTime)

				Camera.context(() => {

					Mouse.update()

					Controller.update()
					Controller.draw(draw, guiDraw)

					Level.update()
					Level.draw(draw, guiDraw)

					rightClickMenu.update()
					rightClickMenu.draw(draw, guiDraw)

					Text.updateAll()

					Mouse.draw(draw, guiDraw)

					if (MouseEditor.active) {
						MouseEditor.active.update()
						MouseEditor.active.draw(draw, guiDraw)
					}
				})

				// showLogs.draw()

				Palette.fill(backgroundPalette, 'black')
				Palette.apply(mainPalette, [backgroundPalette, Camera.palette, guiPalette])
			})
		})
	})
})
	.catch(err => {
		console.error('Image failed to load', err)
		throw err
	})
