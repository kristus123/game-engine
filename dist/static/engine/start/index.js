import { Draw } from '/static/engine/Draw.js'; 
import { G } from '/static/engine/G.js'; 
import { Level } from '/static/engine/Level.js'; 
import { Loop } from '/static/engine/Loop.js'; 
import { AsepriteJson } from '/static/engine/aseprite/AsepriteJson.js'; 
import { AsepriteLayerJson } from '/static/engine/aseprite/AsepriteLayerJson.js'; 
import { a } from '/static/engine/assertions/a.js'; 
import { Sound } from '/static/engine/audio/Sound.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Enhance_html } from '/static/engine/enhance/Enhance_html.js'; 
import { Enhance_js_Array } from '/static/engine/enhance/Enhance_js_Array.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { SpriteLayers } from '/static/engine/graphics/sprite/SpriteLayers.js'; 
import { Palette } from '/static/engine/palette/Palette.js'; 
import { Physics } from '/static/engine/physics/Physics.js'; 
import { AsepriteTilesJson } from '/static/engine/start/AsepriteTilesJson.js'; 
import { D1 } from '/static/engine/start/D1.js'; 
import { HotReload } from '/static/engine/start/HotReload.js'; 
import { LoadAudio } from '/static/engine/start/LoadAudio.js'; 
import { LoadImage } from '/static/engine/start/LoadImage.js'; 
import { LoadJson } from '/static/engine/start/LoadJson.js'; 
import { World } from '/static/game/World.js'; 
import { TileSheet } from '/static/game/tiles/TileSheet.js'; 

export const index = ''

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js')
}

document.body.addEventListener('touchmove', e => {
	while (e.target && e.target !== document.body) {
		if (e.target.classList && e.target.classList.contains('scroll')) {
			// allow scroll
		}
		else {
			e.target = e.target.parentNode
		}
	}

	e.preventDefault()
}, { passive: false })


HotReload()

Enhance_js_Array()
Enhance_html()

function loadAsepriteAssets(path) {

	const fileName = path.split('/').pop()

	if (!path.includes('_tilemaps.json')) {

		const p1 = Promise.all([
			LoadImage(`${path}Layers.png`),
			LoadJson(`${path}Layers.json`),
		]).then(([img, json]) => {
			G.SpriteLayers[fileName] = pos => new SpriteLayers(pos, img, new AsepriteLayerJson(json))
		})

		const p2 = Promise.all([
			LoadImage(`${path}.png`),
			LoadJson(`${path}.json`),
		]).then(([img, json]) => {
			G.image[fileName] = img
			G.Sprite[fileName] = pos => new Sprite(pos, img, new AsepriteJson(json))
		})

		return Promise.all([p1, p2])
	}
}

function loadAllAudio() {
	return Promise.all(["/static/audio/click.mp3","/static/audio/nyaSheet.mp3","/static/audio/placeDirt.mp3","/static/audio/sheet.mp3"].map(a =>
		LoadAudio(a).then(audio => {
			const key = a.split('/').pop().replace('.mp3', '')
			G.Audio[key] = audio
		})
	))
}

function loadAsepriteTilemaps(path) {

	const fileName = path.split('/').pop().replace('_tilemaps.json', '')

	if (path.includes('_tilemaps.json')) {
		path = path.replace('/static/assets/', '/static/assets/aseprite/')

		return LoadJson(path).then(json => {
			if (json) {
				G.TileSheet[fileName] = new TileSheet(new AsepriteTilesJson(json), G.image[fileName])
			}
		})
	}
}

Promise.all([
	Promise.all(["/static/assets/ally","/static/assets/enemy","/static/assets/flower","/static/assets/goat","/static/assets/grass","/static/assets/grassTile","/static/assets/hamtaro","/static/assets/house","/static/assets/icon","/static/assets/new_farmer","/static/assets/new_world","/static/assets/new_world_tilemaps.json","/static/assets/p2","/static/assets/player/player","/static/assets/player/viking","/static/assets/pokemonCity","/static/assets/sign","/static/assets/sky","/static/assets/test","/static/assets/tractor","/static/assets/turret","/static/assets/waterTile","/static/assets/wheat","/static/assets/world","/static/assets/world_tilemaps.json"].map(loadAsepriteAssets)).then(() => Promise.all(["/static/assets/ally","/static/assets/enemy","/static/assets/flower","/static/assets/goat","/static/assets/grass","/static/assets/grassTile","/static/assets/hamtaro","/static/assets/house","/static/assets/icon","/static/assets/new_farmer","/static/assets/new_world","/static/assets/new_world_tilemaps.json","/static/assets/p2","/static/assets/player/player","/static/assets/player/viking","/static/assets/pokemonCity","/static/assets/sign","/static/assets/sky","/static/assets/test","/static/assets/tractor","/static/assets/turret","/static/assets/waterTile","/static/assets/wheat","/static/assets/world","/static/assets/world_tilemaps.json"].map(loadAsepriteTilemaps))),
	loadAllAudio(),
])
	.then(() => {
		const mainPalette = Palette.main()
		const backgroundPalette = Palette.offscreen()

		Sound.init()
		Mouse.initialize()
		Controller.init()
		Camera.initialize()
		Mouse.initializeAfterCameraIsInitialized()

		const draw = new Draw(Camera.palette.ctx)
		D1.ctx = Camera.palette.ctx

		Level.change(new World())

		Loop.everyFrame(deltaTime => {
			Camera.palette.clear()

			Physics.update(deltaTime)

			Camera.context(() => {

				Controller.update()

				Level.update()
				Level.draw(draw)

				Mouse.update()
			})

			backgroundPalette.fill('#10204f')

			mainPalette.apply(backgroundPalette)
			mainPalette.apply(Camera.palette)
		})
	})
	.catch(err => {
		console.error('Image failed to load', err)
		throw err
	})
