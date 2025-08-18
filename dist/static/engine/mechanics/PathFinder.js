import { G } from '/static/engine/G.js'; 
import { List } from '/static/engine/List.js'; 
import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Path } from '/static/engine/npc/Path.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class PathFinder {
	constructor(source, target, gridSize = 50) {

				AssertNotNull(source, "argument source in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(target, "argument target in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(gridSize, "argument gridSize in " + this.constructor.name + ".js should not be null")
			
		this.source = source; 
		this.target = target; 
		this.gridSize = gridSize; 

		this.current = source.position.copy()
		this.gridSize = gridSize
		this.path = []
		this.success = false
		this.speed = 5

		this.openList = []
		this.cameFrom = new Map()
		this.closedSet = new Set()
		this.searching = false
		this.nodesPerFrame = 20
		this.lastTargetKey = this._gridKey(target)
	}

	_gridKey(position) {
		return `${Math.floor(position.x / this.gridSize)},${Math.floor(position.y / this.gridSize)}`
	}

	_isWalkable(position) {
		if (position.x === this.target.x && position.y === this.target.y) {
			return true
		}

		const blocked = G.invisibleWalls.objects.some(w =>
			position.x < w.position.x + w.position.width &&
		position.x + this.gridSize > w.position.x &&
		position.y < w.position.y + w.position.height &&
		position.y + this.gridSize > w.position.y
		)

		if (blocked) {
			return false
		}

		if (G.walkableAreas.positions) {
			return G.walkableAreas.positions.some(w =>
				position.x + this.gridSize > w.x &&
			position.x < w.x + w.width &&
			position.y + this.gridSize > w.y &&
			position.y < w.y + w.height
			)
		}

		return true
	}

	_neighbors(position) {
		const dirs = [
			{ x: 1, y: 0 },
			{ x: -1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 0, y: -1 }
		]
		return dirs
			.map(d => new Position(position.x + d.x * this.gridSize, position.y + d.y * this.gridSize))
			.filter(p => this._isWalkable(p))
	}


	_heuristic(a, b) {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
	}

	_startSearch() {
		this.openList = [{
			position: this.current.copy(),
			g: 0,
			f: this._heuristic(this.current, this.target)
		}]
		this.cameFrom = new Map([[this._gridKey(this.current), null]])
		this.closedSet = new Set()
		this.searching = true
	}

	_continueSearch() {
		for (let i = 0; i < this.nodesPerFrame && this.openList.length; i++) {
			this.openList.sort((a, b) => a.f - b.f)
			const node = this.openList.shift()
			const key = this._gridKey(node.position)
			if (this.closedSet.has(key)) {
				continue
			}
			this.closedSet.add(key)

			if (Math.abs(node.position.x - this.target.x) < this.gridSize &&
				Math.abs(node.position.y - this.target.y) < this.gridSize) {
				this._reconstructPath(key)
				this.searching = false
				return
			}

			for (const neighbor of this._neighbors(node.position)) {
				const nKey = this._gridKey(neighbor)
				if (this.closedSet.has(nKey)) {
					continue
				}

				const g = node.g + this.gridSize
				const f = g + this._heuristic(neighbor, this.target)
				const existing = this.openList.find(n => this._gridKey(n.position) === nKey)
				if (!existing || g < existing.g) {
					this.cameFrom.set(nKey, node.position.copy())
					if (!existing) {
						this.openList.push({ position: neighbor, g, f })
					}
				}
			}
		}
		if (!this.openList.length) {
			this.searching = false
		}
	}

	_reconstructPath(endKey) {
		const path = [{ x: this.target.x, y: this.target.y }]
		let key = endKey
		while (this.cameFrom.has(key) && this.cameFrom.get(key)) {
			const prev = this.cameFrom.get(key)
			path.unshift(prev.copy())
			key = this._gridKey(prev)
		}
		this.path = path
	}

	update() {
		const targetKey = this._gridKey(this.target)

		if (targetKey !== this.lastTargetKey || (!this.path.length && !this.searching)) {
			this._startSearch()
			this.lastTargetKey = targetKey
		}

		if (this.searching) {
			this._continueSearch()
		}

		if (this.path.length) {
			const next = this.path[0]
			const dx = next.x - this.current.x
			const dy = next.y - this.current.y
			const dist = Math.hypot(dx, dy)

			if (dist <= this.speed) {
				this.current.x = next.x
				this.current.y = next.y
				this.path.shift()
			}
			else {
				this.current.x += (dx / dist) * this.speed
				this.current.y += (dy / dist) * this.speed
			}

			if (Math.hypot(this.current.x - this.target.x, this.current.y - this.target.y) < this.gridSize) {
				this.success = true
			}
		}
	}

	draw(draw) {
		draw.rectangle(new Position(this.current.x, this.current.y, this.gridSize, this.gridSize), 'blue')
		this.path.forEach(p => draw.rectangle(new Position(p.x, p.y, this.gridSize, this.gridSize), 'lightblue'))
		draw.line(this.current, this.target)
	}
}

