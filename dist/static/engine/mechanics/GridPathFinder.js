import { G } from '/static/engine/G.js'; 
import { List } from '/static/engine/List.js'; 
import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Collision } from '/static/engine/physics/Collision.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class GridPathFinder {
	constructor(gridSize = 50) {

				AssertNotNull(gridSize, "argument gridSize in " + this.constructor.name + ".js should not be null")
			
		this.gridSize = gridSize; 

		this.gridSize = gridSize
		this.path = []
	}

	_gridKey(position) {
		return `${Math.floor(position.x / this.gridSize)},${Math.floor(position.y / this.gridSize)}`
	}

	get nextPosition() {
		const n = this.path[1]
		if (n) {
			return n
		}
		else {
			return null
		}
	}

	_walkable_neighbors(position) {
		const directions = [
			{ x: 1, y: 0 },
			{ x: -1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 0, y: -1 }
		]

		return directions
			.map(d => new Position(position.x + d.x * this.gridSize, position.y + d.y * this.gridSize))
			.filter(pos => {
				if (G.invisibleWalls.positions.some(w => Collision.between(w, pos))) {
					return false
				}
				else {
					return G.walkableAreas.positions.some(w => Collision.between(w, pos))
				}
			})
	}

	_heuristic(a, b) {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
	}

	update(source, target) {
		this.path = []

		const start = source.position.copy()
		const targetPosition = target.position.copy()
		const openList = [{ position: start, g: 0, f: this._heuristic(start, targetPosition) }]

		const cameFrom = new Map([[this._gridKey(start), null]])

		const closedSet = new Set()

		while (openList.length) {
			openList.sort((a, b) => a.f - b.f)
			const node = openList.shift()
			const endKey = this._gridKey(node.position)
			if (closedSet.has(endKey)) continue
			closedSet.add(endKey)

			if (Math.abs(node.position.x - targetPosition.x) < this.gridSize &&
				Math.abs(node.position.y - targetPosition.y) < this.gridSize) {

				const path = [{ x: targetPosition.x, y: targetPosition.y }]
				let key = endKey
				while (cameFrom.has(key) && cameFrom.get(key)) {
					const prev = cameFrom.get(key)
					path.unshift(prev.copy())
					key = this._gridKey(prev)
				}

				this.path = path
			}
			else {
				for (const neighbor of this._walkable_neighbors(node.position)) {
					const nKey = this._gridKey(neighbor)
					if (closedSet.has(nKey)) continue

					const g = node.g + this.gridSize
					const f = g + this._heuristic(neighbor, targetPosition)
					const existing = openList.find(n => this._gridKey(n.position) === nKey)

					if (!existing || g < existing.g) {
						cameFrom.set(nKey, node.position.copy())
						if (!existing) openList.push({ position: neighbor, g, f })
					}
				}
			}
		}
	}

	draw(draw) {
		this.path.forEach(p => draw.rectangle(p))
	}
}

