class Random {
	static numberBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	static color() {
		return `hsl(${Math.random() * 360}, 100%, 50%)`
	}
	
}
