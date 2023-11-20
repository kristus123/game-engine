export const Push = (o) => ({
	awayFrom: (target) => {
		o.velocity.x -= -target.velocity.x / 3
		o.velocity.y -= -target.velocity.y / 3
	},
	towards: (position) => {
		const vel = Calculate.velocity(o, position)

		o.velocity.x -= vel.x * Random.floatBetween(0.1, 0.4) * 1
		o.velocity.y -= vel.y * Random.floatBetween(0.1, 0.4) * 1
	}
});
