export class Positions {
	static grid(position, size) {
		const positions = []

		for (let y = position.y; y < position.y + position.height; y = y+1 + size) {
			for (let x = position.x; x < position.x + position.width; x = x+1 + size) {
				positions.push(Position(x, y, size, size))
			}
		}

		return positions
	}

}
