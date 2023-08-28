import { Loop } from '/static/Loop.js';
import { Draw } from '/static/Draw.js';
import { Camera } from '/static/Camera.js';
import { Palette } from '/static/Palette.js';
import { Mouse } from '/static/Mouse.js'
import { LevelHandler } from '/static/LevelHandler.js'
import { Random } from '/static/Random.js'
import { Schedule } from '/static/Schedule.js'

const numStars = 1000
const stars = []
for (let i = 0; i < numStars; i++) {
	const x = Random.numberBetween(-1000, 10000)
	const y = Random.numberBetween(-1000, 10000)
	const width = Math.random() * 1 + 1; // Varying star widths
	const height = Math.random() * 1 + 1; // Varying star heights

	stars.push({x, y, width, height})
}

const mainPalette = Palette.main()
const guiPalette = Palette.offscreen()
const backgroundPalette = Palette.offscreen()

const schedule = new Schedule()

let objectToFollow = { x: 0, y: 0, }
const camera = new Camera()

const mouse = new Mouse(camera)

const level = new LevelHandler(f => objectToFollow = f, mouse)

Loop.everyFrame(deltaTime => {
	Palette.clear([camera.palette, guiPalette])

	level.updatePhysics(deltaTime)

	camera.context(() => {
		camera.follow(objectToFollow) // Keep this after physics.update and within camera.context
		level.update()
		level.draw(camera.palette.ctx)
	})

	schedule.everyFrame(10, () => {
		// Palette.clear([backgroundPalette])
		Palette.fill(backgroundPalette, 'black')
		const player = level.outsideLevel.player
		backgroundPalette.ctx.fillStyle = 'white'
		stars.forEach(s => {
			Draw.rectangle(backgroundPalette.ctx, s.x - player.x / 100, s.y - player.y / 100, s.width, s.height)
		})
	}, 60*2)

	Draw.text(guiPalette.ctx, 20, 20, 80, 80, Loop.fps)
	Palette.apply(mainPalette, [backgroundPalette, camera.palette, guiPalette])
})
