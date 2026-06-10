export class TestRandom {
	constructor(min, max, ms, run = () => {}) {
    	this.value = Random.integerBetween(min, max)
    	this.elapsed = 0
	}

	update() {
    	this.elapsed += DeltaTime.ms

    	if (this.elapsed >= this.ms) {
        	this.value = Random.integerBetween(this.min, this.max)
        	this.elapsed = 0
    	}

    	this.run(this.value)
	}
}