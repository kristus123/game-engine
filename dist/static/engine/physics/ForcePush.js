import { Random } from '/static/engine/Random.js'; 
import { Push } from '/static/engine/physics/Push.js'; 

export const ForcePush = (o) => ({
	awayFrom: (position, multiplier=1) => {
		const dir = Math.atan2(o.y - position.y, o.x - position.x)

		o.velocity.x = Math.cos(dir) * o.velocityFactor * multiplier
		o.velocity.y = Math.sin(dir) * o.velocityFactor * multiplier
	},
	towards: (position, multiplier=1) => {
		const dir = Math.atan2(position.y - o.y, position.x - o.x)

		o.velocity.x = Math.cos(dir) * o.velocityFactor * multiplier
		o.velocity.y = Math.sin(dir) * o.velocityFactor * multiplier
	},

	randomly: (multiplier=1) => {
		const position = {
			x: o.x + Random.integerBetween(-10, 10),
			y: o.y + Random.integerBetween(-10, 10),
		}
		const dir = Math.atan2(position.y - o.y, position.x - o.x)

		o.velocity.x = Math.cos(dir) * o.velocityFactor * multiplier
		o.velocity.y = Math.sin(dir) * o.velocityFactor * multiplier
	},
	roughlyTowards: (position, multiplier=1) => {
		const angleSpread = 0.9

		const direction_x = position.x - o.x
		const direction_y = position.y - o.y

		const initialAngle = Math.atan2(direction_y, direction_x)
		const spread = Random.floatBetween(-angleSpread / 2, angleSpread / 2)
		const angle = initialAngle + spread

		const p = {
			x: Math.cos(angle) * Random.floatBetween(1, 5),
			y: Math.sin(angle) * Random.floatBetween(1, 5),
		}

		ForcePush(o).towards(p, multiplier)
	},
})
