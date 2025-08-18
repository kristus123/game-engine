import { List } from '/static/engine/List.js'; 
import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Path } from '/static/engine/npc/Path.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class SimplePathFinder {
	constructor(ally, player, invisibleWalls, gridSize = 100) {

				AssertNotNull(ally, "argument ally in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(invisibleWalls, "argument invisibleWalls in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(gridSize, "argument gridSize in " + this.constructor.name + ".js should not be null")
			
		this.ally = ally; 
		this.player = player; 
		this.invisibleWalls = invisibleWalls; 
		this.gridSize = gridSize; 

		this.current = ally.position.copy()
		this.gridSize = gridSize
		this.path = []
		this.success = false
		this.speed = 5

		this.invisibleWalls = invisibleWalls
		this.openList = []
		this.cameFrom = new Map()
		this.closedSet = new Set()
		this.searching = false
		this.nodesPerFrame = 20
		this.lastTargetKey = this._gridKey(player)
	}

	_gridKey(position) {
		return `${Math.floor(position.x / this.gridSize)},${Math.floor(position.y / this.gridSize)}`
	}

	_isWalkable(position) {
		if (position.x === this.player.x && position.y === this.player.y) {
			return true
		}
		else {
			return !this.invisibleWalls.some(w =>
				position.x < w.x + w.width &&
				position.x + this.gridSize > w.x &&
				position.y < w.y + w.height &&
				position.y + this.gridSize > w.y)
		}
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
			f: this._heuristic(this.current, this.player)
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
			if (this.closedSet.has(key)) continue
			this.closedSet.add(key)

			if (Math.abs(node.position.x - this.player.x) < this.gridSize &&
				Math.abs(node.position.y - this.player.y) < this.gridSize) {
				this._reconstructPath(key)
				this.searching = false
				return
			}

			for (const neighbor of this._neighbors(node.position)) {
				const nKey = this._gridKey(neighbor)
				if (this.closedSet.has(nKey)) continue

				const g = node.g + this.gridSize
				const f = g + this._heuristic(neighbor, this.player)
				const existing = this.openList.find(n => this._gridKey(n.position) === nKey)
				if (!existing || g < existing.g) {
					this.cameFrom.set(nKey, node.position.copy())
					if (!existing) this.openList.push({ position: neighbor, g, f })
				}
			}
		}
		if (!this.openList.length) this.searching = false
	}

	_reconstructPath(endKey) {
		const path = [{ x: this.player.x, y: this.player.y }]
		let key = endKey
		while (this.cameFrom.has(key) && this.cameFrom.get(key)) {
			const prev = this.cameFrom.get(key)
			path.unshift(prev.copy())
			key = this._gridKey(prev)
		}
		this.path = path
	}

	update() {
		const targetKey = this._gridKey(this.player)
		if (targetKey !== this.lastTargetKey || (!this.path.length && !this.searching)) {
			this._startSearch()
			this.lastTargetKey = targetKey
		}

		if (this.searching) this._continueSearch()

		if (this.path.length) {
			const next = this.path[0]
			const dx = next.x - this.current.x
			const dy = next.y - this.current.y
			const dist = Math.hypot(dx, dy)
			if (dist <= this.speed) {
				this.current.x = next.x
				this.current.y = next.y
				this.path.shift()
			} else {
				this.current.x += (dx / dist) * this.speed
				this.current.y += (dy / dist) * this.speed
			}
			if (Math.hypot(this.current.x - this.player.x, this.current.y - this.player.y) < this.gridSize) {
				this.success = true
			}
		}
	}

	draw(draw) {
		draw.rectangle(new Position(this.current.x, this.current.y, this.gridSize, this.gridSize), 'blue')
		this.path.forEach(p => draw.rectangle(new Position(p.x, p.y, this.gridSize, this.gridSize), 'lightblue'))
		this.invisibleWalls.forEach(w => draw.rectangle(new Position(w.x, w.y, w.width, w.height), 'red'))
		draw.line(this.current, this.player)
	}
}

