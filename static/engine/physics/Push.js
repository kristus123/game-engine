export const Push = (o) => ({
	awayFrom: (target) => {
		if (target.velocity.x === 0 || target.velocity.y === 0) {
			console.log("aaaaa")	 // todo fix
		}
		else {
			o.velocity.x -= -target.velocity.x / 3
			o.velocity.y -= -target.velocity.y / 3
		}
	},
	towards: (position) => {
		const vel = Calculate.velocity(o, position)

		o.velocity.x += vel.x * Random.floatBetween(0.1, 0.4) * 10
		o.velocity.y += vel.y * Random.floatBetween(0.1, 0.4) * 10
	}
})
