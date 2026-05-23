export class ShadowSource {

	static color = "black"
	static opacity = 1

	static update() {
		Palette.light.fill(this.color, this.opacity)
	}
}
