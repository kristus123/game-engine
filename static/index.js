import { Loop } from '/static/Loop.js';
import { Draw } from '/static/Draw.js';
import { Camera } from '/static/Camera.js';
import { Canvas } from '/static/Canvas.js';
import { Level } from '/static/Level.js';

const main = Canvas.main()
const gui = Canvas.offscreen()
const world = Canvas.offscreen()

const camera = new Camera([world.ctx])

const level = new Level(camera)

Loop.everyFrame(deltaTime => {
	Canvas.clear([world, gui])

	world.ctx.fillStyle = "black"
	world.ctx.fillRect(0, 0, Canvas.width, Canvas.height)

	level.runFrame(deltaTime, world)
	Draw.text(gui.ctx, 100, 100, 100, 100, Loop.fps)

	Canvas.apply(main, [world, gui])
})
