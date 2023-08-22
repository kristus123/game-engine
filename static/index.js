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

	world.ctx.fillStyle = "black"
	world.ctx.fillRect(0, 0, Palette.width, Palette.height)

	level.runFrame(deltaTime, world)
	Draw.text(gui.ctx, 100, 100, 100, 100, Loop.fps)

	Palette.apply(main, [world, gui])
})
