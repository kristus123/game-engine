export class Get {
	static Position(o) {
		if (o instanceof Position) {
			return o
		}
		else if (o.position instanceof Position) {
			return o.position
		}
		else {
			console.log("ERROR")
		}
	}
	
}
