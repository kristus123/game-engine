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

	static direction(o, amount) {
		const x = Random.integerBetween(o.x - amount, o.x + amount)
		const y = Random.integerBetween(o.y - amount, o.y + amount)

		return new Position(x, y)
	}

	static position(minX, maxX, minY, maxY) {
		const randomX = Random.integerBetween(minX, maxX)
		const randomY = Random.integerBetween(minY, maxY)

		return new Position(randomX, randomY, 1, 1)
	}

	static positions(minX, maxX, minY, maxY, amount) {
		const positions = []

		for (let i = 0; i < amount; i++) {
			positions.push(Random.position(minX, maxX, minY, maxY))
		}

		return positions
	}

	static uuid() {
	  return crypto.randomUUID().toString()
	}
}
