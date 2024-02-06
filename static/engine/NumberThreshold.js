export class NumberThreshold {

	static update(number, threshold) {
		if (Math.abs(number) < threshold) {
			return 0
		}
		else {
			return number
		}
	}
}

