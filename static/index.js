const objects = []
function add(o) {
	objects.push(o)
	return o
}

const camera = add(new Camera())
const player = add(new Player())
const projectile = add(new Projectile(750, 360, 10, "red"))
const timer = add(new Timer())

const gameObject = add(new GameObject(0, 0, 1000, 10))

const physics = add(new Physics())
physics.add(player)
physics.add(gameObject)
physics.add(projectile)


GameLoop.update = (ctx, canvas) => {
	camera.follow(ctx, player)

	objects.forEach(o => {
		o.update()
	})

	physics.update()
}

GameLoop.draw = (ctx, canvas) => {
	objects.forEach(o => o.draw(ctx))
}

const {ctx, canvas} = GameLoop.start()

document.addEventListener('click', (e) => {
	const pos = camera.mousePosition(ctx, canvas, e)
	projectile.shoot(pos.x, pos.y)
})
