//
// PriorityQueue implementation using a binary heap
class PriorityQueue {
	constructor(compare) {
		this.heap = []
		this.compare = compare
	}

	enqueue(element) {
		this.heap.push(element)
		this._heapifyUp(this.heap.length - 1)
	}

	dequeue() {
		const root = this.heap[0]
		const end = this.heap.pop()
		if (this.heap.length > 0) {
			this.heap[0] = end
			this._heapifyDown(0)
		}
		return root
	}

	isEmpty() {
		return this.heap.length === 0
	}

	_heapifyUp(index) {
		const element = this.heap[index]
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2)
			const parent = this.heap[parentIndex]
			if (this.compare(element, parent) >= 0) {
				break
			}
			this.heap[index] = parent
			index = parentIndex
		}
		this.heap[index] = element
	}

	_heapifyDown(index) {
		const length = this.heap.length
		const element = this.heap[index]
		while (true) {
			const leftChildIndex = 2 * index + 1
			const rightChildIndex = 2 * index + 2
			let swap = null

			if (leftChildIndex < length) {
				const leftChild = this.heap[leftChildIndex]
				if (this.compare(leftChild, element) < 0) {
					swap = leftChildIndex
				}
			}
			if (rightChildIndex < length) {
				const rightChild = this.heap[rightChildIndex]
				if ((swap === null && this.compare(rightChild, element) < 0) ||
            (swap !== null && this.compare(rightChild, this.heap[swap]) < 0)) {
					swap = rightChildIndex
				}
			}
			if (swap === null) {
				break
			}
			this.heap[index] = this.heap[swap]
			index = swap
		}
		this.heap[index] = element
	}
}

// Constants for cell size
const CELL_SIZE = 10 // Adjust based on your needs

// Heuristic function (Manhattan distance) adjusted for larger cells
function heuristic(a, b) {
	return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y)) / CELL_SIZE
}

// Check if a position is valid (not colliding with walls) considering larger cells
function isValidPosition(x, y, walls) {
	const pos = new Position(Math.floor(x / CELL_SIZE) * CELL_SIZE, Math.floor(y / CELL_SIZE) * CELL_SIZE, CELL_SIZE, CELL_SIZE)
	return !isColliding(pos, walls)
}

// Get neighbors for a node with larger cells
function getNeighbors(node, walls) {
	const neighbors = []
	const directions = [
		{ x: -CELL_SIZE, y: 0 },
		{ x: CELL_SIZE, y: 0 },
		{ x: 0, y: -CELL_SIZE },
		{ x: 0, y: CELL_SIZE }
	]

	directions.forEach(dir => {
		const x = node.x + dir.x
		const y = node.y + dir.y
		if (isValidPosition(x, y, walls)) {
			neighbors.push({ x, y, parent: node })
		}
	})

	return neighbors
}

// A* pathfinding algorithm with larger cells and logging
function astar(start, end, walls, onPathFound) {
	console.log('Starting A* pathfinding...')

	const openList = new PriorityQueue((a, b) => a.f - b.f)
	const closedList = new Set()

	const startNode = { x: Math.floor(start.x / CELL_SIZE) * CELL_SIZE, y: Math.floor(start.y / CELL_SIZE) * CELL_SIZE, g: 0, h: heuristic(start, end), f: heuristic(start, end), parent: null }
	const endNode = { x: Math.floor(end.x / CELL_SIZE) * CELL_SIZE, y: Math.floor(end.y / CELL_SIZE) * CELL_SIZE }

	openList.enqueue(startNode)
	const visited = new Set()
	visited.add(`${startNode.x},${startNode.y}`)

	const path = []
	let nodesProcessed = 0

	function processChunk() {
		let nodesInThisChunk = 0
		const chunkSize = 100 // Number of nodes to process per frame

		while (nodesInThisChunk < chunkSize && !openList.isEmpty()) {
			nodesProcessed++
			const currentNode = openList.dequeue()
			const currentKey = `${currentNode.x},${currentNode.y}`

			console.log(`Processing node: ${currentNode.x}, ${currentNode.y}. Nodes processed: ${nodesProcessed}`)

			if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
				let current = currentNode
				while (current) {
					path.push(new Position(current.x, current.y, 1, 1))
					current = current.parent
				}
				path.reverse()
				console.log('Path found!')
				if (onPathFound) {
					onPathFound(path)
				}
				return
			}

			closedList.add(currentKey)

			const neighbors = getNeighbors(currentNode, walls)
			neighbors.forEach(neighbor => {
				const key = `${neighbor.x},${neighbor.y}`
				if (closedList.has(key)) {
					return
				}

				const g = currentNode.g + CELL_SIZE
				const h = heuristic(neighbor, endNode)
				const f = g + h

				if (visited.has(key)) {
					const existingNode = openList.heap.find(node => node.x === neighbor.x && node.y === neighbor.y)
					if (existingNode && g >= existingNode.g) {
						return
					}
				}

				neighbor.g = g
				neighbor.h = h
				neighbor.f = f
				neighbor.parent = currentNode

				openList.enqueue(neighbor)
				visited.add(key)
			})

			nodesInThisChunk++
		}

		// Allow other tasks to process
		requestAnimationFrame(processChunk)
	}

	processChunk()
}

// Move NPC along the path
function moveNPC(npc, path) {
	if (path.length > 0) {
		const nextStep = path.shift()
		npc.x = nextStep.x
		npc.y = nextStep.y
	}
}

// Assuming Position and isColliding functions are defined elsewhere
function isColliding(pos, walls) {
	return walls.some(wall => Collision.between(pos, wall))
}

// PathFinder class to handle NPC movement and pathfinding
export class PathFinder {
	constructor(object, end, invisibleWalls) {
		this.object = object
		this.invisibleWalls = invisibleWalls
		this.end = new Position(end.x, end.y, CELL_SIZE, CELL_SIZE)
		this.path = []
		this.processing = false

		this.updatePath()

	  this.localObjects = new LocalObjects([
		  object,
		  ...invisibleWalls,
	  ])
	}

	updatePath() {
		console.log('Updating path...')
		this.processing = true
		astar(this.object, this.end, this.invisibleWalls, (path) => {
			this.path = path
			this.processing = false
			console.log('Path update complete.')

			// Start moving the NPC if there is a path
			const movementInterval = setInterval(() => {
				if (!this.processing) {
					moveNPC(this.object, this.path)
					if (this.path.length === 0) {
						console.log('Path completed.')
			  this.completed = true
						clearInterval(movementInterval)
					}
				}
			}, 100) // Adjust the interval as needed
		}, () => {
			// This function is called on each update
		})
	}

	update() {
		// Update game logic if necessary
	  this.localObjects.update()
	}

	draw(draw, guiDraw) {
	  this.localObjects.draw(draw, guiDraw)
	  draw.rectangle(this.end, 'orange')
		// Draw game elements if necessary
	}
}

