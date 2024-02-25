export const ForcePush = (o) => ({
	awayFrom: (position, multiplier=1) => {
		const dir = Math.atan2(o.y - position.y, o.x - position.x)

		o.velocity.x += Math.cos(dir) * o.velocityFactor * multiplier
		o.velocity.y += Math.sin(dir) * o.velocityFactor * multiplier
	},
	towards: (position, multiplier=1) => {
		const dir = Math.atan2(position.y - o.y, position.x - o.x)

		o.velocity.x = Math.cos(dir) * o.velocityFactor * multiplier
		o.velocity.y = Math.sin(dir) * o.velocityFactor * multiplier
	}
})
