export class Grid {
  constructor(offsetX = 0, offsetY = 0, width = 1000, height = 1000, cellsX = 8, cellsY = 8) {
    this.width = width
    this.height = height

    // Calculate cell size based on grid size and number of cells
    this.cellSizeX = this.width / cellsX
    this.cellSizeY = this.height / cellsY

    // If you want square cells, take the smaller of the two
    this.cellSize = Math.min(this.cellSizeX, this.cellSizeY)

    this.positions = []

    for (let x = offsetX; x < this.width; x += this.cellSize) {
      for (let y = offsetY; y < this.height; y += this.cellSize) {
        this.positions.push(new Position(x,y, this.cellSize, this.cellSize))
      }
    }
  }

  snappedPosition(position) {
    const cellX = Math.floor(position.x / this.cellSize)
    const cellY = Math.floor(position.y / this.cellSize)

    const x = cellX * this.cellSize
    const y = cellY * this.cellSize

    return new Position(x, y, this.cellSize, this.cellSize)
  }

  draw(draw, guiDraw) {
    draw.rectangle(this.snappedPosition(Mouse.position))

    draw.ctx.strokeStyle = 'white'
    draw.ctx.lineWidth = 3

    for (const pos of this.positions) {
      draw.ctx.strokeRect(pos.x, pos.y, this.cellSize, this.cellSize)
    }
  }
}

