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

const worker = new WorkerClient()
const gui = new Gui()

GameLoop.eachFrame = (ctx, deltaTime) => {
	physics.update(deltaTime)
	camera.follow(ctx, player)

	objects.forEach(o => {
		o.update(deltaTime)
	})

	worker.draw(ctx)

	objects.forEach(o => o.draw(ctx))

	gui.draw(ctx, camera)
}

const canvas = GameLoop.start(width, height)

document.addEventListener('click', (e) => {
	projectile.shoot(camera.mousePosition(canvas, e))
})

document.addEventListener('mousemove', (e) => {
	camera.currentMousePosition = camera.mousePosition(canvas, e)
})
