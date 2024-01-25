export class RandomSeed {
	constructor(seedString) {
		this.myrng = new Math.seedrandom(seedString);
	}

	getFloat() {
		console.log(this.myrng.quick())
	}

	getInteger() {
		console.log(this.myrng.int32())
	}
}
