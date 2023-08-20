import { Canvas } from '/static/Canvas.js';
import { Physics } from '/static/Physics.js';
import { Player } from '/static/Player.js';
import { Projectile } from '/static/Projectile.js';
import { Camera } from '/static/Camera.js';
import { Loop } from '/static/Loop.js';
import { Circle } from '/static/Circle.js';
import { Draw } from '/static/Draw.js';
import { PrettyParticles } from '/static/PrettyParticles.js';

export class LevelOne {
	constructor() {
		const width = window.innerWidth;
		const height = window.innerHeight;

		this.width = width
		this.height = height

		this.gui = Canvas.offscreen(width, height)
		this.main = Canvas.main(width, height)
		this.world = Canvas.offscreen(width, height)

		this.camera = new Camera(width, height, [this.world.ctx])
		this.player = new Player()
		this.prettyParticles = new PrettyParticles()
		this.projectile = new Projectile(750, 360, 10, "red")

		this.physics = new Physics()
		this.physics.applyTo(this.player)
		this.physics.applyTo(this.projectile)


		document.addEventListener('click', (e) => {
			console.log("hehiehi")
			this.projectile.shoot(this.camera.mousePosition(e))
		})
	}

	runFrame(deltaTime) {
		this.camera.context(() => {

			this.world.ctx.fillStyle = "black"
			this.world.ctx.fillRect(0, 0, this.width, this.height)

			this.physics.update(deltaTime)
			this.camera.follow(this.player) // Keep this after physics.update

			this.prettyParticles.create(this.player.x, this.player.y)
			Draw.objectThatIsMovingInRectangularPathAroundObject(
				this.world.ctx, this.player, this.camera.currentMousePosition)

			this.physics.objects.forEach(o => o.update(deltaTime))
			this.prettyParticles.draw(this.world.ctx)
			this.physics.objects.forEach(o => o.draw(this.world.ctx))

			const c = new Circle(10, 10, 200, 'red')
			if (c.inside(this.player)) {
				c.color = 'blue'
				Draw.hollowCircle(this.world.ctx, 10, 10, 200)
				Draw.text(this.world.ctx, 10, -200, 250, 100, 'Press "e" to buy"')
			} else {
				c.color = 'red'
				c.draw(this.world.ctx)
			}
		})

		Draw.text(this.gui.ctx, 10, 10, 100, 100, Loop.fps)

		this.world.ctx.drawImage(this.gui.canvas, 0, 0)
		this.main.ctx.drawImage(this.world.canvas, 0, 0)
	}
	
}
