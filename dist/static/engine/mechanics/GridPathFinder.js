import { G } from '/static/engine/G.js'; 
import { List } from '/static/engine/List.js'; 
import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class GridPathFinder {
	constructor(gridSize = 100) {

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
		if (n) return n
		return null
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
			.filter(pos => !G.invisibleWalls.collides(pos) && G.walkableAreas.inside(pos))
	}

	_heuristic(a, b) {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
	}

update(source, target) {
    this.path = []

    const start = source.position.copy()
    let targetPosition = target.position.copy()

    if (G.walkableAreas.outside(targetPosition)) {
        const containing = G.walkableAreas.closestRect(targetPosition)
        if (containing) {
            targetPosition.x = Math.min(Math.max(targetPosition.x, containing.x), containing.x + containing.width)
            targetPosition.y = Math.min(Math.max(targetPosition.y, containing.y), containing.y + containing.height)
        } else {
            return
        }
    }

    const openList = [{ position: start, g: 0, f: this._heuristic(start, targetPosition) }]
    const cameFrom = new Map([[this._gridKey(start), null]])
    const closedSet = new Set()
    let closestNode = { position: start, g: 0, f: this._heuristic(start, targetPosition) }
    let closestDist = this._heuristic(start, targetPosition)

    while (openList.length) {
        openList.sort((a, b) => a.f - b.f)
        const node = openList.shift()
        const key = this._gridKey(node.position)
        if (closedSet.has(key)) continue
        closedSet.add(key)

        const dist = this._heuristic(node.position, targetPosition)
        if (dist < closestDist) {
            closestDist = dist
            closestNode = node
        }

        if (dist < this.gridSize) {
            let path = [targetPosition.copy()]
            let k = key
            while (cameFrom.has(k) && cameFrom.get(k)) {
                const prev = cameFrom.get(k)
                path.unshift(prev.copy())
                k = this._gridKey(prev)
            }
            this.path = path
            return
        }

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

    // If no path reached target, return path to closest reachable node
    let path = [closestNode.position.copy()]
    let k = this._gridKey(closestNode.position)
    while (cameFrom.has(k) && cameFrom.get(k)) {
        const prev = cameFrom.get(k)
        path.unshift(prev.copy())
        k = this._gridKey(prev)
    }
    this.path = path
}

	draw(draw) {
		this.path.forEach(p => draw.rectangle(p))
	}
}

