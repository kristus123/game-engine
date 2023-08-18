const objects = []
function add(o) {
	objects.push(o)
	return o
}

const width = window.innerWidth;
const height = window.innerHeight;

const player = add(new Player())
const camera = add(new Camera(width, height, player))
const projectile = add(new Projectile(750, 360, 10, "red"))

const physics = new Physics()
physics.add(player)
physics.add(projectile)

const gui = new Gui()

const wowo = new WorkerClient(width, height, player, camera)

GameLoop.eachFrame = (ctx, contexts, deltaTime) => {
	physics.update(deltaTime)
	camera.follow(contexts, player)
	wowo.draw(ctx)

	objects.forEach(o => {
		o.update(deltaTime)
	})

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
