export function Enhance_number() {
	Enhance(Number, 'isStrictInteger', function () {
    	return Number.isInteger(v) && !String(v).includes('.')
	})
	Enhance(Number, 'round', function () {
    	return Math.round(this)
	})
}


