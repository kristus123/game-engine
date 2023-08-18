const objects = []
function add(o) {
	objects.push(o)
	return o
}

const width = window.innerWidth;
const height = window.innerHeight;

const camera = add(new Camera(width, height))
const player = add(new Player())
const projectile = add(new Projectile(750, 360, 10, "red"))

const physics = new Physics()
physics.add(player)
physics.add(projectile)

const gui = new Gui()

GameLoop.camera = camera

GameLoop.eachFrame = (ctx, offscreenContext, deltaTime) => {
	physics.update(deltaTime)
	camera.follow(ctx, offscreenContext, player)

	objects.forEach(o => {
		o.update(deltaTime)
	})

	objects.forEach(o => o.draw(ctx))

	Draw.rectangle(offscreenContext, player.x, player.y, 100, 100)

	gui.draw(ctx, camera)

}

const canvas = GameLoop.start(width, height)

document.addEventListener('click', (e) => {
	projectile.shoot(camera.mousePosition(canvas, e))
})

document.addEventListener('mousemove', (e) => {
	camera.currentMousePosition = camera.mousePosition(canvas, e)
})
