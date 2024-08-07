export const Move = (o) => ({
	awayFrom: (position, multiplier=1) => {
		const dir = Math.atan2(o.y - position.y, o.x - position.x)
		o.x += Math.cos(dir) * o.velocityFactor * multiplier
		o.y += Math.sin(dir) * o.velocityFactor * multiplier

	},
	towards: (position, multiplier=1) => {
		const dir = Math.atan2(position.y - o.y, position.x - o.x)

		o.x += Math.cos(dir) * o.velocityFactor * multiplier
		o.y += Math.sin(dir) * o.velocityFactor * multiplier
	},

	 to: (position, degreesOffset, multiplier = 1) => {
        const dir = Math.atan2(position.y - o.y, position.x - o.x);
        const offsetDir = dir + (degreesOffset * Math.PI / 180); // Apply the offset in radians
        o.x += Math.cos(offsetDir) * o.velocityFactor * multiplier;
        o.y += Math.sin(offsetDir) * o.velocityFactor * multiplier;
    },

})
