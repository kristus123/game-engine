import { Loop } from '/static/Loop.js';
import { Draw } from '/static/Draw.js';
import { Camera } from '/static/Camera.js';
import { Palette } from '/static/Palette.js';
import { Level } from '/static/Level.js';
import { Mouse } from '/static/Mouse.js'

const mainPalette = Palette.main()
const guiPalette = Palette.offscreen()

const camera = new Camera()
const mouse = new Mouse(camera)

const level = new Level(mouse)

Loop.everyFrame(deltaTime => {
	Palette.clear([camera.palette, guiPalette])
	Palette.fill(camera.palette, 'black')

	level.updatePhysics(deltaTime)

	camera.context(() => {
		camera.follow(level.objectToFollow) // Keep this after physics.update and within camera.context

		level.update()

		level.drawCameraContext(camera.palette.ctx)

		Draw.text(guiPalette.ctx, 100, 100, 100, 100, Loop.fps)

		Palette.apply(mainPalette, [camera.palette, guiPalette])
	})
})
