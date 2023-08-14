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
const timer = add(new Timer())

const physics = new Physics()
const go = add(new GameObject(500, 40, 400, 10))
go.fixed = true

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

const {ctx, canvas} = GameLoop.start(width, height)

document.addEventListener('click', (e) => {
	const pos = camera.mousePosition(ctx, canvas, e)
	projectile.shoot(pos.x, pos.y)
})
