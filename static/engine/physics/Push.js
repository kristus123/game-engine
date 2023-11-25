export const Push = (o) => ({
	awayFrom: (target) => {
		if (target.velocity.x === 0 || target.velocity.y === 0) {
			//
		}
		else {
			o.velocity.x -= -target.velocity.x / 3
			o.velocity.y -= -target.velocity.y / 3
		}
	},
	towards: (position, multiplier=1) => {
		const dir = Math.atan2(position.y - o.y, position.x - o.x)
		o.velocity = {
			x: Math.cos(dir) * o.velocityFactor * multiplier,
			y: Math.sin(dir) * o.velocityFactor * multiplier,
		}
	}
})
