export class Random {
	static integerBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	static floatBetween(min, max) {
		const randomValue = Math.random() * (max - min) + min
		return parseFloat(randomValue.toFixed(2))
	}

	static color() {
		return `hsl(${Math.random() * 360}, 100%, 50%)`
	}

	static choice(list) {
		return list[Math.floor(Math.random() * list.length)]
	}

	static positions(topLeftPosition, bottomRightPosition, amount) {
		const positions = []
		for (let i = 0; i < amount; i++) {
			const x = Random.integerBetween(topLeftPosition.x, bottomRightPosition.x)
			const y = Random.integerBetween(topLeftPosition.y, bottomRightPosition.y)

			positions.push(new Position(x, y, 1, 1))
		}

		return positions
	}


}
