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

// for (let i = 10000; i < 20000; i+= 40) {
// 	add(new Particle(10, 10, i, 0.03))
// }

GameLoop.update = (ctx, deltaTime) => {
	camera.follow(ctx, player)

	objects.forEach(o => {
		o.update(deltaTime)
	})

	physics.update(deltaTime)
}

GameLoop.draw = (ctx) => {
	objects.forEach(o => o.draw(ctx))
}

const canvas = GameLoop.start(width, height)

document.addEventListener('click', (e) => {
	projectile.shoot(camera.mousePosition(canvas, e))
})

document.addEventListener('mousemove', (e) => {
	camera.currentMousePosition = camera.mousePosition(canvas, e)
})
