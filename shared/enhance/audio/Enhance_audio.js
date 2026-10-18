export class Enhance_audio extends NativeEnhancer {

	constructor() {
		super(AudioNode.prototype)
	}
	routeTo(target) {
		this.connect(target.input ?? target)
		return target
	}
}
