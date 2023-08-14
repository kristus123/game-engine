const objects = []
function add(o) {
	objects.push(o)
	return o
}

const camera = add(new Camera())
const player = add(new Player())
const projectile = add(new Projectile(750, 360, 10, "red"))
const timer = add(new Timer())

const physics = add(new Physics())
const go = add(new GameObject(500, 40, 400, 10))

physics.add(go)
physics.add(player)
physics.add(projectile)

GameLoop.update = (ctx, canvas, deltaTime) => {
	camera.follow(ctx, player)

	objects.forEach(o => {
		o.update()

	})

	new Text(player.x, player.y).draw(ctx)

	physics.update(deltaTime)
}

GameLoop.draw = (ctx, canvas, deltaTime) => {
	objects.forEach(o => o.draw(ctx))
}

const {ctx, canvas} = GameLoop.start()

document.addEventListener('click', (e) => {
	const pos = camera.mousePosition(ctx, canvas, e)
	projectile.shoot(pos.x, pos.y)
})
