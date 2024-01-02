// not the best name; 'Get'
export class Get {
	static Position(o) {
		if (o instanceof Position) {
			return o
		}
		else if (o.position instanceof Position) {
			return o.position
		}
		else if (o.x && o.y) {
			return o
		}
		else {
			throw new Error('NOT A POSITION')
		}
	}

}
