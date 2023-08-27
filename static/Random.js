export class Random {
	static numberBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	static floatBetween(min, max) {
		const randomValue = Math.random() * (max - min) + min;
		return parseFloat(randomValue.toFixed(2));
	}


	static color() {
		return `hsl(${Math.random() * 360}, 100%, 50%)`
	}
	
}
