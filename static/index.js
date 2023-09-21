import { Loop } from '/static/scripts/Loop.js';
import { Draw } from '/static/scripts/Draw.js';
import { Camera } from '/static/scripts/Camera.js';
import { Palette } from '/static/scripts/Palette.js';
import { Mouse } from '/static/scripts/Mouse.js'
import { LevelHandler } from '/static/scripts/LevelHandler.js'
import { Schedule } from '/static/scripts/Schedule.js'
import { Stars } from '/static/scripts/Stars.js'
import { Map } from '/static/scripts/Map.js'

const loop = new Loop(120, 5);
const schedule = new Schedule();
const camera = new Camera();
const mouse = new Mouse(camera);
const map = new Map();
const stars = new Stars(map);

const mainPalette = Palette.main();
const guiPalette = Palette.offscreen();
const backgroundPalette = Palette.offscreen();

let objectToFollow = { x: 0, y: 0 };
const level = new LevelHandler(f => objectToFollow = f, mouse)

loop.everyFrame(deltaTime => {
	level.outsideLevel.player;
	level.updatePhysics(deltaTime);

	Palette.clear([camera.palette, guiPalette]);
	camera.context(() => {
		camera.follow(objectToFollow) // Keep this after physics.update and within camera.context
		level.update()
		level.draw(camera.palette.ctx)
	});

	schedule.everyFrame(loop.frameInterval, () => {
		Palette.fill(backgroundPalette, 'black');
		backgroundPalette.ctx.fillStyle = 'white';
		stars.draw(backgroundPalette);
	}, loop.fps)

	Draw.text(guiPalette.ctx, 20, 20, 80, 40, loop.fps, "25px Arial", "white")
	Palette.apply(mainPalette, [backgroundPalette, camera.palette, guiPalette])
});
