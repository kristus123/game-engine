const width = window.innerWidth;
const height = window.innerHeight;

const main = Canvas.main(width, height)
const hidden = Canvas.offscreen(width, height)
const another = Canvas.offscreen(width, height)

const physics = new Physics()
const player = physics.applyTo(new Player())
const projectile = physics.applyTo(new Projectile(750, 360, 10, "red"))

const gui = new Gui()

const camera = new Camera(width, height, [hidden.ctx])

const backgroundImage = new Image();
backgroundImage.src = "static/1920x1080.jpg";

AnimationLoop.everyFrame(deltaTime => {

	camera.worldContext(() => {
		// hidden.ctx.fillStyle = "black"
		hidden.ctx.fillRect(0, 0, width, height)
		hidden.ctx.drawImage(backgroundImage, 0, 0, width, height);

		physics.update(deltaTime)
		camera.follow(player)


		physics.objects.forEach(o => o.update(deltaTime))
		physics.objects.forEach(o => o.draw(hidden.ctx))

		// gui.draw(hidden.ctx, camera)
	})

	Draw.text(another.ctx, 10, 10, 200, 100, 'Jon 117')

	hidden.ctx.drawImage(another.canvas.transferToImageBitmap(), 0, 0);
	main.ctx.drawImage(hidden.canvas, 0, 0)
})

document.addEventListener('click', (e) => {
	projectile.shoot(camera.mousePosition(e))
})
