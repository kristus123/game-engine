export class Random {

	//  todo rename to 'integerBetween'
	static numberBetween(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	};

	static floatBetween(min, max) {
		const randomValue = Math.random() * (max - min) + min;
		return parseFloat(randomValue.toFixed(2));
	}


	static color() {
		return `hsl(${Math.random() * 360}, 100%, 50%)`
	}
	
}
