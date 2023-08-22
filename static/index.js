import { Loop } from '/static/Loop.js';
import { Draw } from '/static/Draw.js';
import { Camera } from '/static/Camera.js';
import { Palette } from '/static/Palette.js';
import { Level } from '/static/Level.js';

const main = Palette.main()
const gui = Palette.offscreen()
const world = Palette.offscreen()

const camera = new Camera([world.ctx])

const level = new Level(camera)

Loop.everyFrame(deltaTime => {
	Palette.clear([world, gui])
	Palette.fill(world, 'black')

	level.physics.update(deltaTime)

	camera.context(() => {
		camera.follow(level.player) // Keep this after physics.update and within camera.context

		level.objects.forEach(
			o => o.update())

		level.objects.forEach(
			o => o.draw(world.ctx)) // needs to be inside camera.context
	})

	Draw.text(gui.ctx, 100, 100, 100, 100, Loop.fps)

	Palette.apply(main, [world, gui])
})
