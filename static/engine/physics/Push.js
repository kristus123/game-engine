export const Push = (o) => ({
	awayFrom: (position, multiplier=1) => {
		const dir = Math.atan2(o.y - position.y, o.x - position.x)
		o.velocity.x += Math.cos(dir) * 100 * multiplier
		o.velocity.y += Math.sin(dir) * 100 * multiplier

	},
	towards: (position, multiplier=1) => {
		const dir = Math.atan2(position.y - o.y, position.x - o.x)

		o.velocity.x += Math.cos(dir) * 100 * multiplier
		o.velocity.y += Math.sin(dir) * 100 * multiplier
	},
	roughlyTowards: (position, multiplier=1) => {
		ForcePush(o).roughlyTowards(position, multiplier)
	}
})
