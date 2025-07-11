import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 

export class Particle {

	static towards(spawnPosition, targetPosition) {

		const size = Random.floatBetween(1, 5)
		const particle = new DynamicGameObject(new Position(spawnPosition.x, spawnPosition.y, size, size), 1, 4000)

		Push(particle).roughlyTowards(targetPosition, 0.1)

		return particle
	}
}
