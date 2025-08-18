import { G } from '/static/engine/G.js'; 
import { List } from '/static/engine/List.js'; 
import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Path } from '/static/engine/npc/Path.js'; 
import { Collision } from '/static/engine/physics/Collision.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class GridPathFinder {
	constructor(source, target, gridSize = 50) {

				AssertNotNull(source, "argument source in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(target, "argument target in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(gridSize, "argument gridSize in " + this.constructor.name + ".js should not be null")
			
		this.source = source; 
		this.target = target; 
		this.gridSize = gridSize; 

		this.source = source
		this.target = target
		this.gridSize = gridSize
		this.path = []
	}

	_gridKey(position) {
		return `${Math.floor(position.x / this.gridSize)},${Math.floor(position.y / this.gridSize)}`
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
				if (G.invisibleWalls.objects.some(w => Collision.between(w, pos))) {
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

	_reconstructPath(cameFrom, endKey, target) {
		const path = [{ x: target.x, y: target.y }]
		let key = endKey
		while (cameFrom.has(key) && cameFrom.get(key)) {
			const prev = cameFrom.get(key)
			path.unshift(prev.copy())
			key = this._gridKey(prev)
		}
		return path
	}

	update() {
		this.path = []

		const start = this.source.position.copy()
		const target = this.target.position.copy()
		const openList = [{ position: start, g: 0, f: this._heuristic(start, target) }]

		const cameFrom = new Map([[this._gridKey(start), null]])

		const closedSet = new Set()

		while (openList.length) {
			openList.sort((a, b) => a.f - b.f)
			const node = openList.shift()
			const key = this._gridKey(node.position)
			if (closedSet.has(key)) continue
			closedSet.add(key)

			if (Math.abs(node.position.x - target.x) < this.gridSize &&
				Math.abs(node.position.y - target.y) < this.gridSize) {
				this.path = this._reconstructPath(cameFrom, key, target)
			}
			else {
				for (const neighbor of this._walkable_neighbors(node.position)) {
					const nKey = this._gridKey(neighbor)
					if (closedSet.has(nKey)) continue

					const g = node.g + this.gridSize
					const f = g + this._heuristic(neighbor, target)
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
		this.path.forEach(p => draw.rectangle(new Position(p.x, p.y, this.gridSize, this.gridSize), 'lightblue'))
	}
}

