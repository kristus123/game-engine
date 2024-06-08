export class Positions {
	static grid(position, size) {
		const positions = []

        for (let y = 0; y < position.height; y++) {
            for (let x = 0; x < position.width; x++) {
                const nx = x * size
                const ny = y * size

				positions.push(new Position(nx, ny, size, size))
            }
        }

		return positions
	}

}
