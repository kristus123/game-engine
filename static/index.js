import { Canvas } from '/static/Canvas.js';
import { Physics } from '/static/Physics.js';
import { Player } from '/static/Player.js';
import { Projectile } from '/static/Projectile.js';
import { Camera } from '/static/Camera.js';
import { Loop } from '/static/Loop.js';
import { Circle } from '/static/Circle.js';
import { Draw } from '/static/Draw.js';
import { PrettyParticles } from '/static/PrettyParticles.js';

const width = window.innerWidth;
const height = window.innerHeight;

const main = Canvas.main(width, height)
const world = Canvas.offscreen(width, height)
const gui = Canvas.offscreen(width, height)

const physics = new Physics()

const player = physics.applyTo(new Player())
const prettyParticles = new PrettyParticles()

const projectile = physics.applyTo(new Projectile(750, 360, 10, "red"))

const camera = new Camera(width, height, [world.ctx])

Loop.everyFrame(deltaTime => {
	camera.context(() => {

		world.ctx.fillStyle = "black"
		world.ctx.fillRect(0, 0, width, height)


		camera.follow(player)

		physics.update(deltaTime)

		prettyParticles.create(player.x, player.y)

		physics.objects.forEach(o => o.update(deltaTime))
		prettyParticles.draw(world.ctx)
		physics.objects.forEach(o => o.draw(world.ctx))
		const c = new Circle(10, 10, 200, 'red')
		if (c.inside(player)) {
			c.color = 'blue'
			Draw.hollowCircle(world.ctx, 10, 10, 200)
			Draw.text(world.ctx, 10, -200, 250, 100, 'Press "e" to buy"')
		} else {
			c.color = 'red'
			c.draw(world.ctx)
		}
	})

	Draw.text(gui.ctx, 10, 10, 100, 100, Loop.fps)

	world.ctx.drawImage(gui.canvas, 0, 0)
	main.ctx.drawImage(world.canvas, 0, 0)
})

document.addEventListener('click', (e) => {
	projectile.shoot(camera.mousePosition(e))
})
