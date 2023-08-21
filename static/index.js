import { Loop } from '/static/Loop.js';
import { Draw } from '/static/Draw.js';
import { LevelOne } from '/static/LevelOne.js';
import { Camera } from '/static/Camera.js';
import { Canvas } from '/static/Canvas.js';

const main = Canvas.main()
const gui = Canvas.offscreen()
const world = Canvas.offscreen()

const camera = new Camera([world.ctx])

const levelOne = new LevelOne(camera)

Loop.everyFrame(deltaTime => {
	Canvas.clear([world, gui])

	world.ctx.fillStyle = "black"
	world.ctx.fillRect(0, 0, Canvas.width, Canvas.height)

	levelOne.runFrame(deltaTime, world)
	Draw.text(gui.ctx, 100, 100, 100, 100, Loop.fps)

	Canvas.apply(main, [world, gui])
})
