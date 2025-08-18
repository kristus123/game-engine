import { G } from '/static/engine/G.js'; 
import { List } from '/static/engine/List.js'; 
import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class PathFinder {
	constructor(start, target, gridSize = 100) {

				AssertNotNull(start, "argument start in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(target, "argument target in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(gridSize, "argument gridSize in " + this.constructor.name + ".js should not be null")
			
		this.start = start; 
		this.target = target; 
		this.gridSize = gridSize; 

		this.current = { x: start.x, y: start.y }
		this.target = target
		this.gridSize = gridSize
		this.path = []
		this.success = false
		this.speed = 2

		this.openList = []
		this.cameFrom = new Map()
		this.closedSet = new Set()
		this.searching = false
		this.nodesPerFrame = 50
		this.lastTargetKey = this._gridKey(target)
	}

	_gridKey(pos) {
		return `${Math.floor(pos.x / this.gridSize)},${Math.floor(pos.y / this.gridSize)}`
	}

	_isBlocked(pos) {
		return this.target.touchesAny(G.invisibleWalls.objects.map(w => w.position))
	}

	_neighbors(pos) {
		const dirs = [
			{ x: 1, y: 0 },
			{ x: -1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 0, y: -1 }
		]
		return dirs
			.map(d => ({ x: pos.x + d.x * this.gridSize, y: pos.y + d.y * this.gridSize }))
			.filter(p => {
				if (p.x === this.target.x && p.y === this.target.y) {
					return true
				}
				return !this._isBlocked(p)
			})
	}

	_heuristic(a, b) {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
	}

	_startSearch() {
		this.openList = [{ pos: { ...this.current }, g: 0, f: this._heuristic(this.current, this.target) }]
		this.cameFrom = new Map()
		this.cameFrom.set(this._gridKey(this.current), null)
		this.closedSet = new Set()
		this.searching = true
	}

	_continueSearch() {
		for (let i = 0; i < this.nodesPerFrame && this.openList.length; i++) {
			this.openList.sort((a, b) => a.f - b.f)
			const currentNode = this.openList.shift()
			const currentKey = this._gridKey(currentNode.pos)
			if (this.closedSet.has(currentKey)) {
				continue
			}
			this.closedSet.add(currentKey)

			if (Math.abs(currentNode.pos.x - this.target.x) < this.gridSize &&
				Math.abs(currentNode.pos.y - this.target.y) < this.gridSize) {
				let path = [{ x: this.target.x, y: this.target.y }]
				let key = currentKey
				while (this.cameFrom.has(key) && this.cameFrom.get(key)) {
					const prev = this.cameFrom.get(key)
					path.unshift({ ...prev })
					key = this._gridKey(prev)
				}
				this.path = path
				this.searching = false
				return
			}

			for (const neighbor of this._neighbors(currentNode.pos)) {
				const key = this._gridKey(neighbor)
				if (this.closedSet.has(key)) {
					continue
				}
				const g = currentNode.g + this.gridSize
				const f = g + this._heuristic(neighbor, this.target)
				const existing = this.openList.find(n => this._gridKey(n.pos) === key)
				if (!existing || g < existing.g) {
					this.cameFrom.set(key, { ...currentNode.pos })
					if (!existing) {
						this.openList.push({ pos: neighbor, g, f })
					}
				}
			}
		}
		if (!this.openList.length) {
			this.searching = false
		}
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
		draw.circle(new Position(this.current.x, this.current.y, this.gridSize, this.gridSize), 5)
		this.path.forEach(p => draw.rectangle(new Position(p.x, p.y, this.gridSize, this.gridSize), 'lightblue'))
		draw.line(this.current, this.target)
	}
}

