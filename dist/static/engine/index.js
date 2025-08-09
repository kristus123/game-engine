import { Draw } from '/static/engine/Draw.js'; 
import { G } from '/static/engine/G.js'; 
import { Level } from '/static/engine/Level.js'; 
import { Loop } from '/static/engine/Loop.js'; 
import { Palette } from '/static/engine/Palette.js'; 
import { RightClickMenu } from '/static/engine/RightClickMenu.js'; 
import { a } from '/static/engine/a.js'; 
import { AsepriteJson } from '/static/engine/aseprite/AsepriteJson.js'; 
import { AsepriteLayerJson } from '/static/engine/aseprite/AsepriteLayerJson.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { SpriteLayers } from '/static/engine/graphics/sprite/SpriteLayers.js'; 
import { Http } from '/static/engine/http/Http.js'; 
import { StaticHttp } from '/static/engine/http/StaticHttp.js'; 
import { ErrorHandler } from '/static/engine/logging/ErrorHandler.js'; 
import { ShowLogs } from '/static/engine/logging/ShowLogs.js'; 
import { Text } from '/static/engine/mechanics/dialogue/Text.js'; 
import { VideoCall } from '/static/engine/multiplayer/socket/VideoCall.js'; 
import { Physics } from '/static/engine/physics/Physics.js'; 
import { Call } from '/static/engine/tools/Call.js'; 
import { World } from '/static/game/World.js'; 

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

const whenLoaded = Promise.all(["/static/assets/enemy.","/static/assets/flower.","/static/assets/goat.","/static/assets/grass.","/static/assets/new_farmer.","/static/assets/player/player.","/static/assets/player/viking.","/static/assets/pokemonCity.","/static/assets/sign.","/static/assets/sky.","/static/assets/test.","/static/assets/tractor.","/static/assets/wheat.","/static/assets/world."].map(path => {
	const fileName = path.split('/').pop()
	const pngPath = path + '.png'
	const asepriteJson = new AsepriteJson(StaticHttp.get(path + '.json'))

	const asepriteLayerJson = new AsepriteLayerJson(StaticHttp.get(path + 'Layers' + '.json'))

	const spriteLayers = loadImage(path + 'Layers.png')
		.then(img => G.SpriteLayers[fileName] = (pos) => new SpriteLayers(pos, img, asepriteLayerJson))

	const sprite = loadImage(pngPath)
		.then(img => G.Sprite[fileName] = (pos) => new Sprite(pos, img, asepriteJson))

	const image = loadImage(pngPath)
		.then(img => G.image[fileName] = img)

	return Promise.all([spriteLayers, sprite, image])
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
