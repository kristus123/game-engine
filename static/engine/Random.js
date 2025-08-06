export class Random {

	static integerBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	static chance() {
		return this.integerBetween(0, 1) == 1
	}

	static percentageChance(number) {
		return this.integerBetween(0, number) == 1
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

	static direction(currentPosition, amount=200) {
		const x = Random.integerBetween(currentPosition.x - amount, currentPosition.x + amount)
		const y = Random.integerBetween(currentPosition.y - amount, currentPosition.y + amount)

		return new Position(x, y)
	}

	static positionWithin(p) {
		return this.position(p.x, p.x + p.width, p.y, p.y + p.height)
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
