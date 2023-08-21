import { Canvas } from '/static/Canvas.js';
import { Physics } from '/static/Physics.js';
import { Player } from '/static/Player.js';
import { Projectile } from '/static/Projectile.js';
import { Camera } from '/static/Camera.js';
import { Loop } from '/static/Loop.js';
import { Draw } from '/static/Draw.js';

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
		this.projectile = new Projectile(750, 360, 10, "red")

		this.physics = new Physics()
		this.physics.applyTo(this.player)
		this.physics.applyTo(this.projectile)

		document.addEventListener('click', (e) => {
			this.projectile.shoot(this.camera.mousePosition(e))
		})
	}

	runFrame(deltaTime) {
		this.world.ctx.fillStyle = "black"
		this.world.ctx.fillRect(0, 0, this.width, this.height)

		this.physics.update(deltaTime)

		this.camera.context(() => {
			this.camera.follow(this.player) // Keep this after physics.update and within camera.context
			this.physics.objects.forEach(o => o.update(deltaTime))
			this.physics.objects.forEach(o => o.draw(this.world.ctx))
		})

		Draw.text(this.gui.ctx, 10, 10, 100, 100, Loop.fps)

		this.world.ctx.drawImage(this.gui.canvas, 0, 0)
		this.main.ctx.drawImage(this.world.canvas, 0, 0)
	}
}
