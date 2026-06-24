export function Enhance_audio() {
	Enhance(AudioNode.prototype, "routeTo", function (target) {
		this.connect(target.input ?? target)
		return target
	})
}
