const width = window.innerWidth;
const height = window.innerHeight;

const main = Canvas.main(width, height)
const hidden = Canvas.offscreen(width, height)

const physics = new Physics()
const player = physics.applyTo(new Player())
const projectile = physics.applyTo(new Projectile(750, 360, 10, "red"))

const camera = new Camera(width, height, [hidden.ctx])

Loop.everyFrame(deltaTime => {
	camera.context(() => {

		hidden.ctx.fillStyle = "black"
		hidden.ctx.fillRect(0, 0, width, height)

		camera.follow(player)

		physics.update(deltaTime)

		physics.objects.forEach(o => o.update(deltaTime))
		physics.objects.forEach(o => o.draw(hidden.ctx))
	})

	main.ctx.drawImage(hidden.canvas, 0, 0)
})

document.addEventListener('click', (e) => {
	projectile.shoot(camera.mousePosition(e))
})
