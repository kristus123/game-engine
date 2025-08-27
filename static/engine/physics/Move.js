export const Move = (o) => ({
	awayFrom: (position, multiplier=1) => {
		const dir = Math.atan2(o.y - position.y, o.x - position.x)
		o.x += Math.cos(dir) * 10 * multiplier
		o.y += Math.sin(dir) * 10 * multiplier

	},
	towards: (position, multiplier=1) => {
		const dir = Math.atan2(position.y - o.y, position.x - o.x)

		o.x += Math.cos(dir) * 10 * multiplier
		o.y += Math.sin(dir) * 10 * multiplier
	},

	 to: (position, degreesOffset, multiplier = 1) => {
		const dir = Math.atan2(position.y - o.y, position.x - o.x)
		const offsetDir = dir + (degreesOffset * Math.PI / 180) // Apply the offset in radians
		o.x += Math.cos(offsetDir) * 10 * multiplier
		o.y += Math.sin(offsetDir) * 10 * multiplier
	},

})
