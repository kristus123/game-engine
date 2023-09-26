import { Loop } from '/static/Loop.js'
import { Draw } from '/static/Draw.js'
import { Camera } from '/static/Camera.js'
import { Palette } from '/static/Palette.js'
import { Mouse } from '/static/Mouse.js'
import { LevelHandler } from '/static/LevelHandler.js'

const mainPalette = Palette.main()
const guiPalette = Palette.offscreen()
const backgroundPalette = Palette.offscreen()

let objectToFollow = { x: 0, y: 0 }
const camera = new Camera()

const mouse = new Mouse(camera)

const level = new LevelHandler((f) => (objectToFollow = f), mouse)

Loop.everyFrame((deltaTime) => {
	Palette.clear([camera.palette, guiPalette])

	level.updatePhysics(deltaTime)

	camera.context(() => {
		camera.follow(objectToFollow) // Keep this after physics.update and within camera.context
		level.update()
		level.draw(camera.palette.ctx)
	})

	Draw.text(guiPalette.ctx, 20, 20, 80, 80, Loop.fps)
	Palette.apply(mainPalette, [backgroundPalette, camera.palette, guiPalette])
})
