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


GameLoop.update = (ctx, deltaTime) => {
	physics.update(deltaTime)
	camera.follow(ctx, player)

	objects.forEach(o => {
		o.update(deltaTime)
	})

}

const worker = new WorkerClient()
GameLoop.draw = (ctx) => {
	worker.draw(ctx)

	objects.forEach(o => o.draw(ctx))

	const p = camera.positionRelativeToScreen(50,  50)
	Draw.text(ctx, p.x, p.y, 100, 50, player.velocity.x)

	const p2 = camera.positionRelativeToScreen(200,  50)
	Draw.text(ctx, p2.x, p2.y, 100, 50, player.velocity.y)


	const p3 = camera.currentMousePosition
	Draw.text(ctx, p3.x, p3.y, 100, 50, "x: " + camera.currentMousePosition.x)
	Draw.text(ctx, p3.x, p3.y- 100, 100, 50, "y: " + camera.currentMousePosition.y)
}

const canvas = GameLoop.start(width, height)

document.addEventListener('click', (e) => {
	projectile.shoot(camera.mousePosition(canvas, e))
})

document.addEventListener('mousemove', (e) => {
	camera.currentMousePosition = camera.mousePosition(canvas, e)
})
