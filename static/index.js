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

for (let i = 0; i < 1000; i+= 10) {
	add(new Particle(10, 10, i, 0.03, player))
}

GameLoop.update = (ctx, canvas, deltaTime) => {
	camera.follow(ctx, player)

	objects.forEach(o => {
		o.update(deltaTime)
	})

	physics.update(deltaTime)
}

GameLoop.draw = (ctx, canvas, deltaTime) => {
	objects.forEach(o => o.draw(ctx))
}

const {ctx, canvas} = GameLoop.start(width, height)

document.addEventListener('click', (e) => {
	const pos = camera.mousePosition(ctx, canvas, e)
	projectile.shoot(pos)
})
